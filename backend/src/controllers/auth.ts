import { Response } from "express";
import { randomBytes } from "crypto";
import prisma from "../lib/prisma";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { AuthRequest } from "../middleware/auth";
import { createAuditLog, createNotification, safeEmailDispatch, sendTransactionalEmail } from "../lib/workflow";

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

function createOneTimeToken(): string {
  return randomBytes(32).toString("hex");
}

function buildVerificationLink(token: string, accountType: "user" | "vendor" | "admin"): string {
  return `${frontendUrl}/verify-email?token=${token}&type=${accountType}`;
}

function buildResetLink(token: string, accountType: "user" | "vendor" | "admin"): string {
  return `${frontendUrl}/reset-password?token=${token}&type=${accountType}`;
}

async function issueVerificationToken(params: {
  email: string;
  accountType: "user" | "vendor" | "admin";
  userId?: string;
  vendorId?: string;
  adminId?: string;
}) {
  const token = createOneTimeToken();

  await prisma.emailVerificationToken.create({
    data: {
      token,
      email: params.email,
      purpose: "EMAIL_VERIFICATION",
      userId: params.userId,
      vendorId: params.vendorId,
      adminId: params.adminId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  return token;
}

async function issuePasswordResetToken(params: {
  email: string;
  accountType: "user" | "vendor" | "admin";
  userId?: string;
  vendorId?: string;
  adminId?: string;
}) {
  const token = createOneTimeToken();

  await prisma.passwordResetToken.create({
    data: {
      token,
      email: params.email,
      userId: params.userId,
      vendorId: params.vendorId,
      adminId: params.adminId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    },
  });

  return token;
}

async function sendVerificationEmail(email: string, name: string, token: string, accountType: "user" | "vendor" | "admin") {
  const verificationLink = buildVerificationLink(token, accountType);

  await sendTransactionalEmail({
    to: email,
    subject: "Verify your email address",
    body: `Hi ${name},\n\nPlease verify your email address to continue using your Solar Compare account.\n\nVerification link: ${verificationLink}\n\nIf you did not create this account, you can ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:24px; color:#0f172a;">
        <div style="max-width:640px; margin:0 auto; background:#fff; border:1px solid #e2e8f0; border-radius:24px; padding:28px;">
          <div style="font-size:12px; letter-spacing:.24em; text-transform:uppercase; color:#b45309; font-weight:700;">Solar Compare by SAFWE ENERGY</div>
          <h1 style="margin:16px 0 12px; font-size:28px; line-height:1.2;">Verify your email</h1>
          <p style="font-size:15px; line-height:1.8; color:#334155;">Hi ${name},</p>
          <p style="font-size:15px; line-height:1.8; color:#334155;">Please verify your email address to continue using your Solar Compare account.</p>
          <p><a href="${verificationLink}" style="display:inline-block; background:#0f172a; color:#fff; text-decoration:none; padding:12px 18px; border-radius:999px; font-weight:700;">Verify email</a></p>
        </div>
      </div>
    `,
  });
}

async function sendResetEmail(email: string, name: string, token: string, accountType: "user" | "vendor" | "admin") {
  const resetLink = buildResetLink(token, accountType);

  await sendTransactionalEmail({
    to: email,
    subject: "Reset your password",
    body: `Hi ${name},\n\nA password reset was requested for your Solar Compare account.\n\nReset link: ${resetLink}\n\nIf you did not request this change, you can ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:24px; color:#0f172a;">
        <div style="max-width:640px; margin:0 auto; background:#fff; border:1px solid #e2e8f0; border-radius:24px; padding:28px;">
          <div style="font-size:12px; letter-spacing:.24em; text-transform:uppercase; color:#b45309; font-weight:700;">Solar Compare by SAFWE ENERGY</div>
          <h1 style="margin:16px 0 12px; font-size:28px; line-height:1.2;">Reset your password</h1>
          <p style="font-size:15px; line-height:1.8; color:#334155;">Hi ${name},</p>
          <p style="font-size:15px; line-height:1.8; color:#334155;">A password reset was requested for your Solar Compare account.</p>
          <p><a href="${resetLink}" style="display:inline-block; background:#0f172a; color:#fff; text-decoration:none; padding:12px 18px; border-radius:999px; font-weight:700;">Reset password</a></p>
        </div>
      </div>
    `,
  });
}

function buildAdminToken(admin: { id: string; email: string; role: string }) {
  return generateToken({
    role: admin.role as "SUPERADMIN" | "ADMIN",
    subjectType: "admin",
    adminId: admin.id,
    email: admin.email,
  });
}

function buildUserToken(user: { id: string; email: string }) {
  return generateToken({
    role: "USER",
    subjectType: "user",
    userId: user.id,
    email: user.email,
  });
}

function buildVendorToken(vendor: { id: string; email: string }) {
  return generateToken({
    role: "VENDOR",
    subjectType: "vendor",
    vendorId: vendor.id,
    email: vendor.email,
  });
}

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const existingAdmin = await prisma.admin.findUnique({ where: { email } });

    if (existingAdmin) {
      res.status(409).json({ error: "Admin already exists" });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "SUPERADMIN",
      },
    });

    await createAuditLog(prisma, {
      actorType: "admin",
      actorId: admin.id,
      action: "admin.registered",
      entityType: "ADMIN",
      entityId: admin.id,
      metadata: { email: admin.email, role: admin.role },
      createdByAdminId: admin.id,
    });

    const token = buildAdminToken(admin);

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin || admin.status !== "ACTIVE") {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await comparePassword(password, admin.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = buildAdminToken(admin);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const registerUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fullName, email, password, phone, city, state } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).json({ error: "Full name, email, and password are required" });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      res.status(409).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phone,
        city,
        state,
      },
    });

    const verificationToken = await issueVerificationToken({
      email: user.email,
      accountType: "user",
      userId: user.id,
    });

    await createNotification(prisma, {
      audience: "ADMIN",
      type: "USER_SIGNUP",
      title: "New user registration",
      body: `${user.fullName} has registered with ${user.email}.`,
      metadata: { userId: user.id, email: user.email },
    });

    await safeEmailDispatch(
      "New user registration",
      `User ${user.fullName} (${user.email}) has created an account.`
    );

    await sendVerificationEmail(user.email, user.fullName, verificationToken, "user");

    await createAuditLog(prisma, {
      actorType: "user",
      actorId: user.id,
      action: "user.registered",
      entityType: "USER",
      entityId: user.id,
      metadata: { email: user.email },
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: buildUserToken(user),
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        state: user.state,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Register user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.status !== "ACTIVE") {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: buildUserToken(user),
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        state: user.state,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Login user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const registerVendor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      companyName,
      ownerName,
      email,
      phone,
      gst,
      serviceArea,
      address,
      businessType,
      experience,
      services = [],
      password,
      documents = [],
    } = req.body;

    if (!companyName || !ownerName || !email || !phone || !serviceArea || !address || !businessType || experience === undefined || !password) {
      res.status(400).json({ error: "Missing required vendor fields" });
      return;
    }

    const existingVendor = await prisma.vendor.findUnique({ where: { email } });

    if (existingVendor) {
      res.status(409).json({ error: "Vendor already exists" });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const vendor = await prisma.vendor.create({
      data: {
        companyName,
        ownerName,
        email,
        phone,
        gst,
        serviceArea,
        address,
        businessType,
        experience: Number(experience),
        services,
        password: hashedPassword,
        status: "PENDING",
        documents: documents.length
          ? {
              create: documents.map((document: { documentName: string; fileUrl: string; fileType: string }) => ({
                documentName: document.documentName,
                fileUrl: document.fileUrl,
                fileType: document.fileType,
              })),
            }
          : undefined,
      },
      include: {
        documents: true,
      },
    });

    const verificationToken = await issueVerificationToken({
      email: vendor.email,
      accountType: "vendor",
      vendorId: vendor.id,
    });

    await prisma.vendorStatusLog.create({
      data: {
        vendorId: vendor.id,
        previousStatus: "PENDING",
        newStatus: "PENDING",
        note: "Vendor application submitted",
      },
    });

    await createNotification(prisma, {
      audience: "ADMIN",
      type: "VENDOR_SIGNUP",
      title: "New vendor application",
      body: `${vendor.companyName} has submitted a vendor application and is pending review.`,
      metadata: { vendorId: vendor.id, email: vendor.email, status: vendor.status },
    });

    await safeEmailDispatch(
      "New vendor application",
      `${vendor.companyName} (${vendor.email}) submitted a vendor application.`
    );

    await sendVerificationEmail(vendor.email, vendor.ownerName, verificationToken, "vendor");

    await createAuditLog(prisma, {
      actorType: "vendor",
      actorId: vendor.id,
      action: "vendor.registered",
      entityType: "VENDOR",
      entityId: vendor.id,
      metadata: { email: vendor.email, status: vendor.status },
    });

    res.status(201).json({
      success: true,
      message: "Vendor application submitted successfully",
      token: buildVendorToken(vendor),
      vendor: {
        id: vendor.id,
        companyName: vendor.companyName,
        ownerName: vendor.ownerName,
        email: vendor.email,
        phone: vendor.phone,
        serviceArea: vendor.serviceArea,
        businessType: vendor.businessType,
        experience: vendor.experience,
        services: vendor.services,
        status: vendor.status,
      },
    });
  } catch (error) {
    console.error("Register vendor error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginVendor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const vendor = await prisma.vendor.findUnique({ where: { email } });

    if (!vendor || vendor.status === "REJECTED") {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await comparePassword(password, vendor.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    res.status(200).json({
      success: true,
      message: vendor.status === "APPROVED" ? "Login successful" : "Login successful. Vendor pending approval.",
      token: buildVendorToken(vendor),
      vendor: {
        id: vendor.id,
        companyName: vendor.companyName,
        ownerName: vendor.ownerName,
        email: vendor.email,
        phone: vendor.phone,
        serviceArea: vendor.serviceArea,
        businessType: vendor.businessType,
        experience: vendor.experience,
        services: vendor.services,
        status: vendor.status,
      },
    });
  } catch (error) {
    console.error("Login vendor error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.adminId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const admin = await prisma.admin.findUnique({
      where: { id: req.adminId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    if (!admin) {
      res.status(404).json({ error: "Admin not found" });
      return;
    }

    res.status(200).json(admin);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.adminId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { name, email } = req.body;

    const admin = await prisma.admin.update({
      where: { id: req.adminId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      admin,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.adminId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "Current password and new password are required" });
      return;
    }

    const admin = await prisma.admin.findUnique({ where: { id: req.adminId } });

    if (!admin) {
      res.status(404).json({ error: "Admin not found" });
      return;
    }

    const isPasswordValid = await comparePassword(currentPassword, admin.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.admin.update({
      where: { id: req.adminId },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const requestEmailVerification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, accountType } = req.body as { email?: string; accountType?: "user" | "vendor" | "admin" };

    if (!email || !accountType) {
      res.status(400).json({ error: "Email and account type are required" });
      return;
    }

    if (accountType === "user") {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const token = await issueVerificationToken({ email: user.email, accountType, userId: user.id });
      await sendVerificationEmail(user.email, user.fullName, token, accountType);
      res.status(200).json({ success: true, message: "Verification email sent" });
      return;
    }

    if (accountType === "vendor") {
      const vendor = await prisma.vendor.findUnique({ where: { email } });
      if (!vendor) {
        res.status(404).json({ error: "Vendor not found" });
        return;
      }

      const token = await issueVerificationToken({ email: vendor.email, accountType, vendorId: vendor.id });
      await sendVerificationEmail(vendor.email, vendor.ownerName, token, accountType);
      res.status(200).json({ success: true, message: "Verification email sent" });
      return;
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      res.status(404).json({ error: "Admin not found" });
      return;
    }

    const token = await issueVerificationToken({ email: admin.email, accountType, adminId: admin.id });
    await sendVerificationEmail(admin.email, admin.name, token, accountType);
    res.status(200).json({ success: true, message: "Verification email sent" });
  } catch (error) {
    console.error("Request verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const confirmEmailVerification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { token } = req.body as { token?: string };

    if (!token) {
      res.status(400).json({ error: "Verification token is required" });
      return;
    }

    const verificationRecord = await prisma.emailVerificationToken.findUnique({ where: { token } });

    if (!verificationRecord || verificationRecord.usedAt || verificationRecord.expiresAt < new Date()) {
      res.status(400).json({ error: "Invalid or expired verification token" });
      return;
    }

    if (verificationRecord.userId) {
      await prisma.user.update({ where: { id: verificationRecord.userId }, data: { emailVerifiedAt: new Date() } });
    }

    if (verificationRecord.vendorId) {
      await prisma.vendor.update({ where: { id: verificationRecord.vendorId }, data: { emailVerifiedAt: new Date() } });
    }

    if (verificationRecord.adminId) {
      await prisma.admin.update({ where: { id: verificationRecord.adminId }, data: { emailVerifiedAt: new Date() } });
    }

    await prisma.emailVerificationToken.update({
      where: { token },
      data: { usedAt: new Date() },
    });

    res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Confirm verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const requestPasswordReset = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, accountType } = req.body as { email?: string; accountType?: "user" | "vendor" | "admin" };

    if (!email || !accountType) {
      res.status(400).json({ error: "Email and account type are required" });
      return;
    }

    if (accountType === "user") {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const token = await issuePasswordResetToken({ email: user.email, accountType, userId: user.id });
      await sendResetEmail(user.email, user.fullName, token, accountType);
      res.status(200).json({ success: true, message: "Password reset email sent" });
      return;
    }

    if (accountType === "vendor") {
      const vendor = await prisma.vendor.findUnique({ where: { email } });
      if (!vendor) {
        res.status(404).json({ error: "Vendor not found" });
        return;
      }

      const token = await issuePasswordResetToken({ email: vendor.email, accountType, vendorId: vendor.id });
      await sendResetEmail(vendor.email, vendor.ownerName, token, accountType);
      res.status(200).json({ success: true, message: "Password reset email sent" });
      return;
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      res.status(404).json({ error: "Admin not found" });
      return;
    }

    const token = await issuePasswordResetToken({ email: admin.email, accountType, adminId: admin.id });
    await sendResetEmail(admin.email, admin.name, token, accountType);
    res.status(200).json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    console.error("Request password reset error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resetPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body as { token?: string; newPassword?: string };

    if (!token || !newPassword) {
      res.status(400).json({ error: "Reset token and new password are required" });
      return;
    }

    const resetRecord = await prisma.passwordResetToken.findUnique({ where: { token } });

    if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
      res.status(400).json({ error: "Invalid or expired reset token" });
      return;
    }

    const hashedPassword = await hashPassword(newPassword);

    if (resetRecord.userId) {
      await prisma.user.update({ where: { id: resetRecord.userId }, data: { password: hashedPassword } });
    }

    if (resetRecord.vendorId) {
      await prisma.vendor.update({ where: { id: resetRecord.vendorId }, data: { password: hashedPassword } });
    }

    if (resetRecord.adminId) {
      await prisma.admin.update({ where: { id: resetRecord.adminId }, data: { password: hashedPassword } });
    }

    await prisma.passwordResetToken.update({ where: { token }, data: { usedAt: new Date() } });

    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};