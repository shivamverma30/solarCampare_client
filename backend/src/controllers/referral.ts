import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";
import { createNotification } from "../lib/workflow";

type ReferralTier = {
  label: string;
  reward: string;
  minimum: number;
  maximum?: number;
};

const referralTiers: ReferralTier[] = [
  { label: "1-5 Referrals", reward: "₹1500 Amazon Voucher", minimum: 1, maximum: 5 },
  { label: "5-15 Referrals", reward: "₹2500 Amazon Voucher", minimum: 5, maximum: 15 },
  { label: "15+ Referrals", reward: "₹4000 Amazon Voucher", minimum: 15 },
];

function getFrontendBaseUrl(): string {
  return (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/+$/, "");
}

function getReferralCode(userId: string): string {
  return Buffer.from(userId, "utf8").toString("base64url");
}

export function decodeReferralCode(referralCode: string): string | null {
  try {
    const trimmed = referralCode.trim();
    if (!trimmed) return null;
    return Buffer.from(trimmed, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

function getReferralLink(userId: string): string {
  return `${getFrontendBaseUrl()}/signup?ref=${getReferralCode(userId)}`;
}

function getTier(count: number) {
  if (count >= 15) return referralTiers[2];
  if (count >= 5) return referralTiers[1];
  if (count >= 1) return referralTiers[0];
  return null;
}

function getProgress(count: number) {
  if (count >= 15) return { current: count, target: 15, percentage: 100 };
  if (count >= 5) return { current: count, target: 15, percentage: Math.min(100, Math.round(((count - 5) / 10) * 100)) };
  return { current: count, target: 5, percentage: Math.min(100, Math.round((count / 5) * 100)) };
}

async function buildReferralStats(userId: string) {
  const [user, notifications] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fullName: true, email: true },
    }),
    prisma.referral.findMany({
      where: { referrerId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        referredUser: {
          select: { id: true, fullName: true, email: true, createdAt: true },
        },
      },
    }),
  ]);

  if (!user) return null;

  const history = notifications.map((referral) => ({
    id: referral.id,
    referredUser: referral.referredUser.fullName,
    signupStatus: referral.signupStatus,
    installationStatus: referral.installationStatus,
    createdAt: referral.createdAt.toISOString(),
  }));

  const totalReferrals = history.length;
  const currentRewardTier = getTier(totalReferrals);

  return {
    user,
    referralLink: getReferralLink(user.id),
    totalReferrals,
    currentRewardTier: currentRewardTier?.label || "No rewards yet",
    currentReward: currentRewardTier?.reward || "Start sharing to unlock rewards",
    rewardProgress: getProgress(totalReferrals),
    rewardTiers: referralTiers,
    referralHistory: history,
  };
}

async function buildAdminReferrals() {
  const referrals = await prisma.referral.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      referrer: {
        select: { id: true, fullName: true, email: true },
      },
      referredUser: {
        select: { id: true, fullName: true, email: true, createdAt: true },
      },
    },
  });

  return referrals.map((referral) => ({
    id: referral.id,
    referrerName: referral.referrer.fullName,
    referredUserName: referral.referredUser.fullName,
    signupStatus: referral.signupStatus,
    installationStatus: referral.installationStatus,
    createdAt: referral.createdAt.toISOString(),
  }));
}

export const getMyReferralRewards = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const referral = await buildReferralStats(req.userId);

    if (!referral) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ success: true, referral });
  } catch (error) {
    console.error("Get referral rewards error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resolveReferralCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const referralCode = String(req.query?.ref || "");
    const referrerId = decodeReferralCode(referralCode);

    if (!referrerId) {
      res.status(404).json({ error: "Invalid referral code" });
      return;
    }

    const referrer = await prisma.user.findUnique({
      where: { id: referrerId },
      select: { id: true, fullName: true },
    });

    if (!referrer) {
      res.status(404).json({ error: "Invalid referral code" });
      return;
    }

    res.status(200).json({ success: true, referrer });
  } catch (error) {
    console.error("Resolve referral code error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const listAdminReferrals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.adminId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const referrals = await buildAdminReferrals();
    res.status(200).json({ success: true, referrals });
  } catch (error) {
    console.error("List admin referrals error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const shareReferralLink = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, fullName: true, email: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const { channel } = req.body as { channel?: string };
    const normalizedChannel = channel === "share" ? "share" : "copy";
    const referralLink = getReferralLink(user.id);

    await Promise.all([
      createNotification(prisma, {
        audience: "ADMIN",
        type: "SYSTEM",
        priority: "MEDIUM",
        title: `User ${user.fullName} shared referral link.`,
        body: `${user.fullName} (${user.email}) shared a referral link.`,
        metadata: {
          category: "referral",
          userId: user.id,
          userName: user.fullName,
          userEmail: user.email,
          referralLink,
          referralCode: getReferralCode(user.id),
          channel: normalizedChannel,
        },
      }),
      createNotification(prisma, {
        audience: "USER",
        userId: user.id,
        type: "SYSTEM",
        priority: "LOW",
        title: normalizedChannel === "share" ? "Referral link shared" : "Referral link copied",
        body: "Your referral link is ready to share with friends.",
        metadata: {
          category: "referral",
          userId: user.id,
          referralLink,
          referralCode: getReferralCode(user.id),
          channel: normalizedChannel,
        },
      }),
    ]);

    const referral = await buildReferralStats(req.userId);
    res.status(200).json({ success: true, referral });
  } catch (error) {
    console.error("Share referral link error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};