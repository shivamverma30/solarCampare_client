"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Copy,
  Crown,
  Gift,
  LineChart,
  ShieldCheck,
  Share2,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth";
import { REFERRAL_REWARD_SLABS, type ReferralRewardSlab } from "@/lib/referral";
import { useAuth } from "@/lib/use-auth";

type ReferralHistoryItem = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  channel: string;
};

type ReferralDetails = {
  user: { id: string; fullName: string; email: string };
  referralLink: string;
  totalReferrals: number;
  currentRewardTier: string;
  currentReward: string;
  rewardProgress: { current: number; target: number; percentage: number };
  rewardTiers: ReferralRewardSlab[];
  referralHistory: ReferralHistoryItem[];
};

type ReferralResponse = {
  referral?: ReferralDetails;
};

type Tone = "cyan" | "amber" | "emerald" | "violet";

export default function ReferralProgram() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, role } = useAuth();
  const token = getToken();
  const isDashboardView = pathname.startsWith("/user/");
  const canShare = Boolean(isAuthenticated && role === "USER" && token);

  const [referral, setReferral] = useState<ReferralDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState<"copy" | "share" | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!token || role !== "USER") {
        setLoading(false);
        return;
      }

      const response = await apiClient.referrals.getMyRewards(token);
      if (response.success) {
        setReferral((response as ReferralResponse).referral || null);
      } else {
        setMessage(response.error || "Failed to load referral rewards.");
      }
      setLoading(false);
    };

    void load();
  }, [role, token]);

  const rewardTiers = referral?.rewardTiers?.length ? referral.rewardTiers : REFERRAL_REWARD_SLABS;
  const referralCount = referral?.totalReferrals || 0;
  const currentTierLabel = referral?.currentRewardTier || "Starter";
  const completionLabel = useMemo(() => {
    if (!referral) return "Start sharing to unlock rewards";
    if (referral.rewardProgress.percentage >= 100) return "Top tier unlocked";
    return `${referral.rewardProgress.current} of ${referral.rewardProgress.target} referrals`;
  }, [referral]);

  const handleShare = async (channel: "copy" | "share") => {
    if (!token || role !== "USER") {
      router.push("/login?next=/referral-rewards");
      return;
    }

    setSharing(channel);
    setMessage("");

    const response = await apiClient.referrals.share(token, { channel });
    const payload = (response as ReferralResponse).referral || referral;

    if (!response.success || !payload) {
      setMessage(response.error || "Unable to update your referral link right now.");
      setSharing(null);
      return;
    }

    setReferral(payload);

    try {
      if (channel === "share" && navigator.share) {
        await navigator.share({
          title: "SolarCompare referral rewards",
          text: "Join me on SolarCompare and claim referral rewards.",
          url: payload.referralLink,
        });
        setMessage("Referral link shared successfully.");
      } else {
        await navigator.clipboard.writeText(payload.referralLink);
        setMessage("Referral link copied to clipboard.");
      }
    } catch {
      setMessage("Referral link is ready to share.");
    }

    setSharing(null);
  };

  return (
    <div className="space-y-8 pb-6 md:space-y-10 md:pb-10">
      {isDashboardView ? (
        <DashboardReferralView
          referral={referral}
          rewardTiers={rewardTiers}
          completionLabel={completionLabel}
          canShare={canShare}
          sharing={sharing}
          loading={loading}
          history={referral?.referralHistory || []}
          message={message}
          onCopy={() => void handleShare("copy")}
          onShare={() => void handleShare("share")}
        />
      ) : (
        <PublicReferralView
          referral={referral}
          rewardTiers={rewardTiers}
          referralCount={referralCount}
          currentTierLabel={currentTierLabel}
          completionLabel={completionLabel}
          canShare={canShare}
          sharing={sharing}
          loading={loading}
          history={referral?.referralHistory || []}
          message={message}
          onStartReferring={() => {
            if (!canShare) {
              router.push("/login?next=/referral-rewards");
              return;
            }
            document.getElementById("sharing-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          onViewRewards={() => document.getElementById("rewards")?.scrollIntoView({ behavior: "smooth", block: "start" })}
          onCopy={() => void handleShare("copy")}
          onShare={() => void handleShare("share")}
        />
      )}
    </div>
  );
}

function PublicReferralView({
  referral,
  rewardTiers,
  referralCount,
  currentTierLabel,
  completionLabel,
  canShare,
  sharing,
  loading,
  history,
  message,
  onStartReferring,
  onViewRewards,
  onCopy,
  onShare,
}: {
  referral: ReferralDetails | null;
  rewardTiers: ReferralRewardSlab[];
  referralCount: number;
  currentTierLabel: string;
  completionLabel: string;
  canShare: boolean;
  sharing: "copy" | "share" | null;
  loading: boolean;
  history: ReferralHistoryItem[];
  message: string;
  onStartReferring: () => void;
  onViewRewards: () => void;
  onCopy: () => void;
  onShare: () => void;
}) {
  const stats = [
    { label: "Total referrals", value: String(referralCount), detail: "Verified and shown here", tone: "cyan" as Tone, icon: Users },
    { label: "Current tier", value: currentTierLabel, detail: referral?.currentReward || "Begin sharing to unlock vouchers", tone: "emerald" as Tone, icon: Crown },
    { label: "Next target", value: String(referral?.rewardProgress.target || 5), detail: `${referral?.rewardProgress.percentage || 0}% progress to the next milestone`, tone: "amber" as Tone, icon: LineChart },
  ];

  return (
    <>
      <section className="relative min-h-[70vh] overflow-hidden rounded-l-none rounded-r-4xl border border-slate-900/10 bg-slate-950 text-white shadow-[0_30px_90px_rgba(15,23,42,0.32)]">
        <div className="absolute inset-0">
          <Image src="/images/refral.png" alt="SolarCompare referral rewards hero background" fill priority sizes="100vw" className="object-cover object-center brightness-110 contrast-105 saturate-110" />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950/70 via-slate-950/50 to-slate-900/20" />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-slate-950/20" />
        </div>

        <div className="relative z-10 flex min-h-[70vh] items-end">
          <div className="w-full px-4 py-6 sm:px-6 md:px-8 lg:px-10 lg:py-10">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/85 backdrop-blur-xl">
                  <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_0_6px_rgba(34,211,238,0.18)]" />
                  Referral Rewards Program
                </div>

                <h1 className="mt-6 text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl xl:leading-[0.95] 2xl:leading-[0.93]">
                  🎉 Refer Friends. Earn Rewards. Go Solar Together.
                </h1>

                <p className="mt-6 max-w-3xl text-base leading-8 text-white/78 md:text-lg lg:text-xl">
                  Invite your friends to SolarCompare and unlock exciting Amazon vouchers while helping more families switch to clean energy.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:flex-wrap">
                  <button
                    type="button"
                    onClick={onStartReferring}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-cyan-400 via-emerald-400 to-amber-300 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_14px_30px_rgba(34,211,238,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(34,211,238,0.25)]"
                  >
                    Start Referring
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={onViewRewards}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/18 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition hover:border-white/30 hover:bg-white/16"
                  >
                    View Rewards
                  </button>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-white/80">
                  <PillBadge icon={ShieldCheck} label="Login required to share" />
                  <PillBadge icon={Gift} label="Amazon vouchers up to ₹4000" />
                  <PillBadge icon={BadgeCheck} label="Public page, private sharing" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 md:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-4xl border border-white/15 bg-white/10 p-2 shadow-[0_24px_60px_rgba(2,6,23,0.34)] backdrop-blur-2xl">
            <div className="rounded-3xl border border-white/10 bg-slate-950/75 p-5 md:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">Reward snapshot</p>
                  <p className="mt-1 text-xl font-semibold text-white">{currentTierLabel}</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white/85">{completionLabel}</div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {stats.map((item) => (
                  <HeroStatCard key={item.label} {...item} />
                ))}
              </div>

              <div className="mt-5 rounded-3xl border border-white/12 bg-white/10 p-4">
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span>Progress to next reward</span>
                  <span>{referral?.rewardProgress.percentage || 0}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-linear-to-r from-cyan-300 via-emerald-300 to-amber-200" style={{ width: `${referral?.rewardProgress.percentage || 0}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-white/55">
                  <span>{referral?.rewardProgress.current || 0} referrals</span>
                  <span>Target {referral?.rewardProgress.target || 5}</span>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {rewardTiers.slice(0, 3).map((tier) => (
                  <RewardTierPreview key={tier.label} tier={tier} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <div id="rewards" className="scroll-mt-24 rounded-4xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.05)] md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Rewards</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Pricing-style reward cards with clear milestones</h2>
            </div>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Premium rewards</div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {rewardTiers.map((tier, index) => (
              <RewardCard key={tier.label} tier={tier} index={index} isCurrent={referral ? tier.label === referral.currentRewardTier : false} progress={getRangeProgress(referralCount, tier.minimum, tier.maximum)} />
            ))}
          </div>
        </div>

        <div className="rounded-4xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.05)] md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">How it works</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">A simple referral flow designed to convert</h2>

          <div className="mt-5 space-y-4">
            {[
              { step: "01", title: "Share Referral Link", text: "Send your personalized SolarCompare link from any device.", icon: Share2, tone: "cyan" as Tone },
              { step: "02", title: "Friend Requests Solar Quote", text: "Your friend explores the calculator or quote flow.", icon: Users, tone: "amber" as Tone },
              { step: "03", title: "Referral Gets Verified", text: "We verify the activity and log the reward event.", icon: ShieldCheck, tone: "emerald" as Tone },
              { step: "04", title: "Earn Amazon Voucher", text: "Your reward tier updates and the voucher journey begins.", icon: Trophy, tone: "violet" as Tone },
            ].map((item, index) => (
              <TimelineCard key={item.title} {...item} index={index} isLast={index === 3} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div id="sharing-panel" className="rounded-4xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.05)] md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Referral link</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Share safely, track every action</h3>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{history.length} history items</div>
          </div>

          {message ? <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">{message}</div> : null}

          <div className="mt-5 rounded-3xl border border-slate-200 bg-linear-to-br from-slate-50 to-white p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Your referral link</p>
            <div className="mt-3 break-all rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-700 shadow-sm">
              {referral?.referralLink || "Your referral link appears here after login."}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:min-w-60">
              <button
                type="button"
                onClick={onCopy}
                disabled={!canShare || sharing !== null || loading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Copy className="h-4 w-4" />
                {sharing === "copy" ? "Copying..." : "Copy Button"}
              </button>
              <button
                type="button"
                onClick={onShare}
                disabled={!canShare || sharing !== null || loading}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Share2 className="h-4 w-4" />
                {sharing === "share" ? "Sharing..." : "Share Button"}
              </button>
            </div>

            {!canShare ? (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Login required to share your referral link, but you can still view the program publicly.
              </div>
            ) : null}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total Referrals" value={String(referralCount)} icon={Users} tone="cyan" />
            <MetricCard label="Current Reward Tier" value={currentTierLabel} icon={Crown} tone="emerald" />
            <MetricCard label="Next Reward Target" value={String(referral?.rewardProgress.target || 5)} icon={LineChart} tone="amber" />
            <MetricCard label="Progress" value={`${referral?.rewardProgress.percentage || 0}%`} icon={Star} tone="violet" />
          </div>

          <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">Milestone tracker</p>
                <h4 className="mt-2 text-xl font-semibold text-white">Current reward path</h4>
              </div>
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/75">{completionLabel}</div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-linear-to-r from-cyan-300 via-emerald-300 to-amber-200" style={{ width: `${referral?.rewardProgress.percentage || 0}%` }} />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {rewardTiers.slice(0, 3).map((tier) => (
                <RewardTierPreview key={tier.label} tier={tier} />
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-4xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.05)] md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Referral history</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Your latest reward and share events</h3>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">{history.length} events</div>
          </div>

          <div className="mt-5 space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-24 animate-pulse rounded-3xl border border-slate-200 bg-slate-50" />
                ))}
              </div>
            ) : history.length ? (
              history.map((item, index) => <HistoryCard key={item.id} item={item} index={index} />)
            ) : (
              <EmptyReferralState />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function DashboardReferralView({
  referral,
  rewardTiers,
  completionLabel,
  canShare,
  sharing,
  loading,
  history,
  message,
  onCopy,
  onShare,
}: {
  referral: ReferralDetails | null;
  rewardTiers: ReferralRewardSlab[];
  completionLabel: string;
  canShare: boolean;
  sharing: "copy" | "share" | null;
  loading: boolean;
  history: ReferralHistoryItem[];
  message: string;
  onCopy: () => void;
  onShare: () => void;
}) {
  const totalReferrals = referral?.totalReferrals || 0;
  const currentTierLabel = referral?.currentRewardTier || "Starter";
  const nextTargetLabel = totalReferrals >= 15 ? "Top tier unlocked" : totalReferrals >= 5 ? "15 referrals" : "5 referrals";

  return (
    <section className="overflow-hidden rounded-4xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
            <Sparkles className="h-3.5 w-3.5" />
            Dashboard Referral Rewards
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">Your referral command center.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">Track rewards, monitor milestones, and share your link without leaving the dashboard.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:w-115">
          <MiniStat label="Current tier" value={currentTierLabel} detail="Reward tier update" tone="emerald" icon={Crown} />
          <MiniStat label="Total referrals" value={String(totalReferrals)} detail="Verified and shown here" tone="cyan" icon={Users} />
          <MiniStat label="Next target" value={nextTargetLabel} detail="Milestone progress" tone="amber" icon={LineChart} />
        </div>
      </div>

      {message ? <div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">{message}</div> : null}

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.06fr_0.94fr]">
        <div className="rounded-4xl border border-slate-200 bg-slate-50 p-5 md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Referral Link</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Copy, share, and earn</h2>
            </div>
            <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">Login verified</div>
          </div>

          <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="break-all font-mono text-sm text-slate-700">{referral?.referralLink || "Your referral link appears here after login."}</div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onCopy}
                disabled={!canShare || sharing !== null || loading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Copy className="h-4 w-4" />
                {sharing === "copy" ? "Copying..." : "Copy Button"}
              </button>
              <button
                type="button"
                onClick={onShare}
                disabled={!canShare || sharing !== null || loading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Share2 className="h-4 w-4" />
                {sharing === "share" ? "Sharing..." : "Share Button"}
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total Referrals" value={String(totalReferrals)} icon={Users} tone="cyan" />
            <MetricCard label="Current Reward Tier" value={currentTierLabel} icon={Crown} tone="emerald" />
            <MetricCard label="Next Reward Target" value={String(referral?.rewardProgress.target || 5)} icon={LineChart} tone="amber" />
            <MetricCard label="Progress" value={`${referral?.rewardProgress.percentage || 0}%`} icon={Star} tone="violet" />
          </div>

          <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">Milestone tracker</p>
                <h4 className="mt-2 text-xl font-semibold text-white">Current reward path</h4>
              </div>
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/75">{completionLabel}</div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-linear-to-r from-cyan-300 via-emerald-300 to-amber-200" style={{ width: `${referral?.rewardProgress.percentage || 0}%` }} />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {rewardTiers.slice(0, 3).map((tier) => (
                <RewardTierPreview key={tier.label} tier={tier} />
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-4xl border border-slate-200 bg-white p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Referral history</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Your latest reward and share events</h3>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">{history.length} events</div>
          </div>

          <div className="mt-5 space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-24 animate-pulse rounded-3xl border border-slate-200 bg-slate-50" />
                ))}
              </div>
            ) : history.length ? (
              history.map((item, index) => <HistoryCard key={item.id} item={item} index={index} />)
            ) : (
              <EmptyReferralState />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStatCard({ label, value, detail, tone, icon: Icon }: { label: string; value: string; detail: string; tone: Tone; icon: ComponentType<{ className?: string }> }) {
  const styles: Record<Tone, string> = {
    cyan: "from-cyan-50 to-white text-cyan-900 border-cyan-100",
    amber: "from-amber-50 to-white text-amber-900 border-amber-100",
    emerald: "from-emerald-50 to-white text-emerald-900 border-emerald-100",
    violet: "from-violet-50 to-white text-violet-900 border-violet-100",
  };

  return (
    <div className={`rounded-3xl border bg-linear-to-br p-4 shadow-sm ${styles[tone]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">{label}</p>
          <p className="mt-2 text-lg font-semibold">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/75 shadow-sm ring-1 ring-black/5">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-2 text-xs leading-6 opacity-75">{detail}</p>
    </div>
  );
}

function MiniStat({ label, value, detail, tone, icon: Icon }: { label: string; value: string; detail: string; tone: Tone; icon: ComponentType<{ className?: string }> }) {
  return (
    <div className={`rounded-3xl border bg-linear-to-br p-4 shadow-sm ${label === "Progress" ? "from-violet-50 to-white text-violet-900 border-violet-100" : tone === "cyan" ? "from-cyan-50 to-white text-cyan-900 border-cyan-100" : tone === "amber" ? "from-amber-50 to-white text-amber-900 border-amber-100" : "from-emerald-50 to-white text-emerald-900 border-emerald-100"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">{label}</p>
          <p className="mt-2 text-lg font-semibold">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/75 shadow-sm ring-1 ring-black/5">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-2 text-xs leading-6 opacity-75">{detail}</p>
    </div>
  );
}

function RewardCard({ tier, index, isCurrent, progress }: { tier: ReferralRewardSlab; index: number; isCurrent: boolean; progress: number }) {
  const accent = ["from-amber-400 via-orange-400 to-rose-400", "from-cyan-400 via-emerald-400 to-teal-400", "from-violet-400 via-fuchsia-400 to-cyan-400"][index] || "from-slate-400 to-slate-500";
  const barWidth = [28, 64, 100][index] || progress;

  return (
    <article className={`group relative overflow-hidden rounded-3xl p-px shadow-[0_16px_40px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.12)] ${isCurrent ? "bg-linear-to-br from-slate-950 via-slate-700 to-cyan-500" : "bg-linear-to-br from-slate-200 via-slate-100 to-slate-200"}`}>
      <div className={`relative flex h-full flex-col rounded-[23px] border border-white/70 bg-white p-5 ${isCurrent ? "ring-2 ring-cyan-200" : ""}`}>
        <div className={`absolute right-4 top-4 h-14 w-14 rounded-full bg-linear-to-br ${accent} opacity-15 blur-xl transition group-hover:opacity-30`} />

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Reward {index + 1}</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{tier.label}</h3>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${accent} text-white shadow-lg`}>
            {isCurrent ? <BadgeCheck className="h-5 w-5" /> : <Gift className="h-5 w-5" />}
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Amazon voucher</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{tier.reward}</p>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>{tier.label}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{isCurrent ? "Current" : "Next up"}</span>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className={`h-full rounded-full bg-linear-to-r ${accent}`} style={{ width: `${barWidth}%` }} />
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Star className="h-4 w-4 text-amber-500" />
          {progress}% of current path
        </div>
      </div>
    </article>
  );
}

function TimelineCard({
  step,
  title,
  text,
  icon: Icon,
  tone,
  index,
  isLast,
}: {
  step: string;
  title: string;
  text: string;
  icon: ComponentType<{ className?: string }>;
  tone: Tone;
  index: number;
  isLast: boolean;
}) {
  const styles: Record<Tone, string> = {
    cyan: "from-cyan-50 to-white text-cyan-700 border-cyan-100",
    amber: "from-amber-50 to-white text-amber-700 border-amber-100",
    emerald: "from-emerald-50 to-white text-emerald-700 border-emerald-100",
    violet: "from-violet-50 to-white text-violet-700 border-violet-100",
  };

  return (
    <div className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.08)]">
      <div className={`rounded-3xl border border-white/75 bg-linear-to-b p-4 ${styles[tone]}`}>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-lg">{step}</div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-slate-950">{title}</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                <Icon className="h-4 w-4 text-slate-700" />
              </div>
            </div>
            <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
          </div>
        </div>
      </div>
      {index < 3 && !isLast ? <div className="absolute inset-x-1/2 bottom-0 hidden h-6 w-px -translate-x-1/2 bg-linear-to-b from-transparent via-slate-300 to-transparent md:block" /> : null}
    </div>
  );
}

function RewardTierPreview({ tier }: { tier: ReferralRewardSlab }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-white">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">{tier.label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{tier.reward}</p>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, tone }: { label: string; value: string; icon: ComponentType<{ className?: string }>; tone: Exclude<Tone, "amber"> | "amber" }) {
  const styles: Record<Tone, string> = {
    cyan: "from-cyan-50 to-white text-cyan-800 ring-cyan-100",
    amber: "from-amber-50 to-white text-amber-800 ring-amber-100",
    emerald: "from-emerald-50 to-white text-emerald-800 ring-emerald-100",
    violet: "from-violet-50 to-white text-violet-800 ring-violet-100",
  };

  return (
    <div className={`rounded-3xl border bg-linear-to-br p-4 shadow-sm ring-1 ${styles[tone]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">{label}</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 shadow-sm ring-1 ring-black/5">
          <Icon className="h-4 w-4 text-slate-700" />
        </div>
      </div>
    </div>
  );
}

function HistoryCard({ item, index }: { item: ReferralHistoryItem; index: number }) {
  const chips = ["bg-cyan-500", "bg-emerald-500", "bg-amber-500", "bg-violet-500"];

  return (
    <article className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]">
      <div className="flex items-start gap-4">
        <div className={`mt-1 h-3 w-3 rounded-full ${chips[index % chips.length]} shadow-[0_0_0_6px_rgba(148,163,184,0.1)]`} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-semibold text-slate-950">{item.title}</p>
              <p className="mt-1 text-sm text-slate-600">{item.description || "Referral activity logged"}</p>
            </div>
            <span className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 ring-1 ring-slate-200">{item.channel}</span>
          </div>
          <p className="mt-3 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </article>
  );
}

function EmptyReferralState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-linear-to-br from-slate-50 to-white p-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100">
        <Sparkles className="h-7 w-7" />
      </div>
      <p className="mt-4 text-base font-semibold text-slate-950">Your referral journey starts here. Share your link and earn exciting rewards.</p>
      <p className="mt-2 text-sm leading-7 text-slate-600">When friends sign up and request a solar quote, your reward history will appear here automatically.</p>
    </div>
  );
}

function PillBadge({ icon: Icon, label }: { icon: ComponentType<{ className?: string }>; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white/80 backdrop-blur-xl">
      <Icon className="h-3.5 w-3.5 text-cyan-200" />
      {label}
    </span>
  );
}

function getRangeProgress(count: number, minimum: number, maximum?: number): number {
  if (count <= 0) return 0;
  if (typeof maximum !== "number") {
    return count >= minimum ? 100 : Math.max(8, Math.round((count / minimum) * 100));
  }

  if (count >= maximum) return 100;
  if (count <= minimum) return 18;

  return Math.max(18, Math.min(100, Math.round(((count - minimum) / (maximum - minimum)) * 100)));
}
