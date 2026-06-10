import { Response } from "express";
import { randomBytes } from "crypto";
import prisma from "../lib/prisma";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { AuthRequest } from "../middleware/auth";
import { createAuditLog, createNotification, safeEmailDispatch, sendTransactionalEmail, welcomeTemplate, otpTemplate } from "../lib/workflow";
import { notificationTemplates } from "../lib/notification-templates";
import { getEnv } from "../lib/env";

const env = getEnv();
const frontendUrl = (env.FRONTEND_URL.split(",").map((origin) => origin.trim()).find(Boolean) || "http://localhost:3000").replace(/\/$/, "");

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

    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

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
    // New OTP-first registration flow: store registration payload in an EmailVerificationToken
    const { fullName, email, password, phone, city, state, pincode } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).json({ error: "Full name, email, and password are required" });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      res.status(409).json({ error: "User already exists" });
      return;
    }

    // Hash the password for temporary storage
    const hashedPassword = await hashPassword(password);

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const hashedOtp = await hashPassword(otp);

    const token = createOneTimeToken();

    // Create verification record with payload (password is stored hashed)
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

    await prisma.emailVerificationToken.create({
      data: {
        token,
        email,
        purpose: "EMAIL_VERIFICATION",
        otpHash: hashedOtp,
        payload: {
          fullName,
          email,
          password: hashedPassword,
          phone,
          city,
          state,
          pincode,
        },
        expiresAt,
      },
    });

    // Notify admin and send OTP email
    const userNotification = notificationTemplates.userRegistered({
      name: fullName,
      email,
      timestamp: new Date(),
    });

    await createNotification(prisma, {
      audience: "ADMIN",
      type: userNotification.type,
      priority: userNotification.priority,
      title: userNotification.title,
      body: userNotification.body,
      metadata: userNotification.metadata,
    });

    await safeEmailDispatch("New user registration", `User ${fullName} (${email}) started registration.`);

    await sendTransactionalEmail({
      to: email,
      subject: "Verify Your Email Address",
      body: `Your verification code is ${otp}. It expires in 10 minutes.`,
      html: otpTemplate(fullName, otp, 10),
    });

    await createAuditLog(prisma, {
      actorType: "system",
      action: "email_otp.issued",
      entityType: "USER",
         entityId: undefined,
      metadata: { email },
    });

    const respPayload: any = { success: true, message: "Verification code sent", token };
    if (process.env.NODE_ENV === "test") respPayload.debugOtp = otp;
    res.status(200).json(respPayload);
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

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

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
        pincode: user.pincode,
        avatarUrl: user.avatarUrl,
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
      fullName,
      businessName,
      companyName,
      ownerName,
      email,
      phone,
      gst,
      serviceArea,
      address,
      city,
      state,
      pincode,
      logoUrl,
      businessType,
      experience,
      services = [],
      password,
      documents = [],
    } = req.body;

    const normalizedCompanyName = String(businessName || companyName || "").trim();
    const normalizedOwnerName = String(fullName || ownerName || "").trim();

    if (!normalizedCompanyName || !normalizedOwnerName || !email || !phone || !serviceArea || !address || !city || !state || !pincode || !businessType || experience === undefined || !password) {
      res.status(400).json({ error: "Missing required vendor fields" });
      return;
    }

    const existingVendor = await prisma.vendor.findUnique({ where: { email } });

    if (existingVendor) {
      res.status(409).json({ error: "Vendor already exists" });
      return;
    }

    // New OTP-first vendor registration: store vendor payload in verification token
    const hashedPassword = await hashPassword(password);

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const hashedOtp = await hashPassword(otp);

    const token = createOneTimeToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

    await prisma.emailVerificationToken.create({
      data: {
        token,
        email,
        purpose: "EMAIL_VERIFICATION",
        otpHash: hashedOtp,
        payload: {
          companyName: normalizedCompanyName,
          ownerName: normalizedOwnerName,
          email,
          phone,
          gst,
          serviceArea,
          address,
          city,
          state,
          pincode,
          logoUrl,
          avatarUrl: logoUrl,
          businessType,
          experience: Number(experience),
          services,
          password: hashedPassword,
          documents,
        },
        expiresAt,
      },
    });

    const vendorNotification = notificationTemplates.vendorRegistered({
      name: normalizedOwnerName,
      email,
      companyName: normalizedCompanyName,
      timestamp: new Date(),
    });

    await createNotification(prisma, {
      audience: "ADMIN",
      type: vendorNotification.type,
      priority: vendorNotification.priority,
      title: vendorNotification.title,
      body: vendorNotification.body,
      metadata: vendorNotification.metadata,
    });

    await safeEmailDispatch("New vendor application", `${normalizedCompanyName} (${email}) started registration.`);

    await sendTransactionalEmail({
      to: email,
      subject: "Verify Your Email Address",
      body: `Your verification code is ${otp}. It expires in 10 minutes.`,
      html: otpTemplate(normalizedOwnerName, otp, 10),
    });

    await createAuditLog(prisma, {
      actorType: "system",
      action: "email_otp.issued",
      entityType: "VENDOR",
         entityId: undefined,
      metadata: { email, companyName: normalizedCompanyName },
    });

    const vendorResp: any = { success: true, message: "Verification code sent", token };
    if (process.env.NODE_ENV === "test") vendorResp.debugOtp = otp;
    res.status(200).json(vendorResp);
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

    if (!vendor) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    if (vendor.status === "PENDING") {
      res.status(403).json({
        error: "Your account is under admin review.",
        status: vendor.status,
      });
      return;
    }

    if (vendor.status === "REJECTED") {
      res.status(403).json({
        error: vendor.rejectionReason || "Your vendor application has been rejected.",
        status: vendor.status,
      });
      return;
    }

    const isPasswordValid = await comparePassword(password, vendor.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    await prisma.vendor.update({
      where: { id: vendor.id },
      data: { lastLoginAt: new Date() },
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: buildVendorToken(vendor),
      vendor: {
        id: vendor.id,
        companyName: vendor.companyName,
        ownerName: vendor.ownerName,
        email: vendor.email,
        phone: vendor.phone,
        serviceArea: vendor.serviceArea,
        city: vendor.city,
        state: vendor.state,
        pincode: vendor.pincode,
        logoUrl: vendor.logoUrl,
        avatarUrl: vendor.avatarUrl,
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
    if (req.adminId) {
      const admin = await prisma.admin.findUnique({
        where: { id: req.adminId },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          role: true,
          status: true,
          lastLoginAt: true,
          createdAt: true,
        },
      });

      if (!admin) {
        res.status(404).json({ error: "Admin not found" });
        return;
      }

      res.status(200).json(admin);
      return;
    }

    if (req.userId) {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          city: true,
          state: true,
          pincode: true,
          avatarUrl: true,
          status: true,
          lastLoginAt: true,
          createdAt: true,
        },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json(user);
      return;
    }

    if (req.vendorId) {
      const vendor = await prisma.vendor.findUnique({
        where: { id: req.vendorId },
        select: {
          id: true,
          companyName: true,
          ownerName: true,
          email: true,
          phone: true,
          address: true,
          city: true,
          state: true,
          pincode: true,
          logoUrl: true,
          avatarUrl: true,
          serviceArea: true,
          businessType: true,
          experience: true,
          services: true,
          status: true,
          rejectionReason: true,
          lastLoginAt: true,
          createdAt: true,
        },
      });

      if (!vendor) {
        res.status(404).json({ error: "Vendor not found" });
        return;
      }

      res.status(200).json(vendor);
      return;
    }

    res.status(401).json({ error: "Unauthorized" });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const listAdminUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.adminId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "").trim().toUpperCase();
    const city = String(req.query.city || "").trim();
    const state = String(req.query.state || "").trim();
    const page = Math.max(1, Number(req.query.page || 1));
    const pageSize = Math.min(50, Math.max(5, Number(req.query.pageSize || 10)));

    const where = {
      ...(status && status !== "ALL" ? { status: status as "ACTIVE" | "INACTIVE" } : {}),
      ...(city ? { city: { contains: city, mode: "insensitive" as const } } : {}),
      ...(state ? { state: { contains: state, mode: "insensitive" as const } } : {}),
      ...(search
        ? {
            OR: [
              { fullName: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
              { phone: { contains: search, mode: "insensitive" as const } },
              { city: { contains: search, mode: "insensitive" as const } },
              { state: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          city: true,
          state: true,
          pincode: true,
          status: true,
          createdAt: true,
          lastLoginAt: true,
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      users,
      count: total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("List admin users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.adminId) {
      const { name, email, avatarUrl } = req.body;

      const admin = await prisma.admin.update({
        where: { id: req.adminId },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(avatarUrl !== undefined && { avatarUrl }),
        },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          role: true,
        },
      });

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        admin,
      });
      return;
    }

    if (req.userId) {
      const { fullName, email, phone, city, state, pincode, avatarUrl } = req.body;

      const user = await prisma.user.update({
        where: { id: req.userId },
        data: {
          ...(fullName && { fullName }),
          ...(email && { email }),
          ...(phone !== undefined && { phone }),
          ...(city !== undefined && { city }),
          ...(state !== undefined && { state }),
          ...(pincode !== undefined && { pincode }),
          ...(avatarUrl !== undefined && { avatarUrl }),
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          city: true,
          state: true,
          pincode: true,
          avatarUrl: true,
          status: true,
        },
      });

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user,
      });
      return;
    }

    if (req.vendorId) {
      const {
        ownerName,
        companyName,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        serviceArea,
        businessType,
        experience,
        services,
        logoUrl,
        avatarUrl,
      } = req.body;

      const vendor = await prisma.vendor.update({
        where: { id: req.vendorId },
        data: {
          ...(ownerName && { ownerName }),
          ...(companyName && { companyName }),
          ...(email && { email }),
          ...(phone !== undefined && { phone }),
          ...(address !== undefined && { address }),
          ...(city !== undefined && { city }),
          ...(state !== undefined && { state }),
          ...(pincode !== undefined && { pincode }),
          ...(serviceArea !== undefined && { serviceArea }),
          ...(businessType !== undefined && { businessType }),
          ...(experience !== undefined && { experience: Number(experience) }),
          ...(services !== undefined && { services }),
          ...(logoUrl !== undefined && { logoUrl }),
          ...(avatarUrl !== undefined && { avatarUrl }),
        },
        select: {
          id: true,
          companyName: true,
          ownerName: true,
          email: true,
          phone: true,
          address: true,
          city: true,
          state: true,
          pincode: true,
          serviceArea: true,
          businessType: true,
          experience: true,
          services: true,
          logoUrl: true,
          avatarUrl: true,
          status: true,
        },
      });

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        vendor,
      });
      return;
    }

    res.status(401).json({ error: "Unauthorized" });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "Current password and new password are required" });
      return;
    }

    const hashedPassword = await hashPassword(newPassword);

    if (req.adminId) {
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

      await prisma.admin.update({ where: { id: req.adminId }, data: { password: hashedPassword } });

      await sendTransactionalEmail({
        to: admin.email,
        subject: "Password changed successfully",
        body: `Hi ${admin.name}, your account password was changed successfully.`,
      });

      res.status(200).json({ success: true, message: "Password changed successfully" });
      return;
    }

    if (req.userId) {
      const user = await prisma.user.findUnique({ where: { id: req.userId } });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const isPasswordValid = await comparePassword(currentPassword, user.password);

      if (!isPasswordValid) {
        res.status(401).json({ error: "Current password is incorrect" });
        return;
      }

      await prisma.user.update({ where: { id: req.userId }, data: { password: hashedPassword } });

      await sendTransactionalEmail({
        to: user.email,
        subject: "Password changed successfully",
        body: `Hi ${user.fullName}, your account password was changed successfully.`,
      });

      res.status(200).json({ success: true, message: "Password changed successfully" });
      return;
    }

    if (req.vendorId) {
      const vendor = await prisma.vendor.findUnique({ where: { id: req.vendorId } });

      if (!vendor) {
        res.status(404).json({ error: "Vendor not found" });
        return;
      }

      const isPasswordValid = await comparePassword(currentPassword, vendor.password);

      if (!isPasswordValid) {
        res.status(401).json({ error: "Current password is incorrect" });
        return;
      }

      await prisma.vendor.update({ where: { id: req.vendorId }, data: { password: hashedPassword } });

      await sendTransactionalEmail({
        to: vendor.email,
        subject: "Password changed successfully",
        body: `Hi ${vendor.ownerName}, your account password was changed successfully.`,
      });

      res.status(200).json({ success: true, message: "Password changed successfully" });
      return;
    }

    res.status(401).json({ error: "Unauthorized" });
    return;

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

    // If this is an OTP-based pending registration (payload + otpHash present)
    if (verificationRecord.otpHash && verificationRecord.payload) {
      if ((verificationRecord.attempts || 0) >= 5) {
        res.status(429).json({ error: "Too many invalid attempts. Please request a new code." });
        return;
      }
      const { otp } = req.body as { otp?: string };
      if (!otp) {
        res.status(400).json({ error: "OTP code is required" });
        return;
      }

      const isOtpValid = await comparePassword(otp, verificationRecord.otpHash);

      if (!isOtpValid) {
        // increment attempts
        await prisma.emailVerificationToken.update({ where: { token }, data: { attempts: { increment: 1 } } });
        res.status(400).json({ error: "Invalid OTP" });
        return;
      }

      // Create user or vendor depending on payload shape
      const payload: any = verificationRecord.payload as any;

      if (payload.fullName) {
        // User registration
        // Check again for existing user
        const exists = await prisma.user.findUnique({ where: { email: verificationRecord.email } });
        if (exists) {
          await prisma.emailVerificationToken.delete({ where: { token } }).catch(() => {});
          res.status(409).json({ error: "User already exists" });
          return;
        }

        const user = await prisma.user.create({
          data: {
            fullName: payload.fullName,
            email: payload.email,
            password: payload.password,
            phone: payload.phone,
            city: payload.city,
            state: payload.state,
            pincode: payload.pincode,
            emailVerifiedAt: new Date(),
          },
        });

        await createAuditLog(prisma, {
          actorType: "user",
          actorId: user.id,
          action: "user.registered",
          entityType: "USER",
          entityId: user.id,
          metadata: { email: user.email },
        });

        await createNotification(prisma, {
          audience: "ADMIN",
          type: "USER_SIGNUP",
          title: "New user registered",
          body: `${user.fullName} has completed registration.`,
          metadata: { userId: user.id, email: user.email },
        });

        // send welcome email
        try {
          await sendTransactionalEmail({
            to: user.email,
            subject: "Welcome to Solar Compare",
            body: `Welcome! Your email has been verified.`,
            html: welcomeTemplate(user.fullName || "User"),
          });
        } catch (err) {
          console.error("Failed to send welcome email:", err);
        }

        await prisma.emailVerificationToken.delete({ where: { token } }).catch(() => {});

        res.status(201).json({ success: true, message: "User registered and verified", user: { id: user.id, email: user.email, fullName: user.fullName } });
        return;
      }

      if (payload.companyName) {
        // Vendor registration
        const exists = await prisma.vendor.findUnique({ where: { email: verificationRecord.email } });
        if (exists) {
          await prisma.emailVerificationToken.delete({ where: { token } }).catch(() => {});
          res.status(409).json({ error: "Vendor already exists" });
          return;
        }

        const vendor = await prisma.vendor.create({
          data: {
            companyName: payload.companyName,
            ownerName: payload.ownerName,
            email: payload.email,
            phone: payload.phone,
            gst: payload.gst,
            serviceArea: payload.serviceArea,
            address: payload.address,
            city: payload.city,
            state: payload.state,
            pincode: payload.pincode,
            logoUrl: payload.logoUrl,
            avatarUrl: payload.avatarUrl,
            businessType: payload.businessType,
            experience: payload.experience ? Number(payload.experience) : 0,
            services: payload.services || [],
            password: payload.password,
            status: "PENDING",
            documents: payload.documents && payload.documents.length ? {
              create: payload.documents.map((d: any) => ({ documentName: d.documentName, fileUrl: d.fileUrl, fileType: d.fileType }))
            } : undefined,
            emailVerifiedAt: new Date(),
          },
        });

        await prisma.vendorStatusLog.create({
          data: {
            vendorId: vendor.id,
            previousStatus: "PENDING",
            newStatus: "PENDING",
            note: "Vendor application submitted",
          },
        }).catch(() => {});

        await createNotification(prisma, {
          audience: "ADMIN",
          type: "VENDOR_SIGNUP",
          title: "New vendor application",
          body: `${vendor.companyName} has submitted a vendor application and is pending review.`,
          metadata: { vendorId: vendor.id, email: vendor.email, status: vendor.status },
        });

        await safeEmailDispatch("New vendor application", `${vendor.companyName} (${vendor.email}) submitted a vendor application.`);

        await createAuditLog(prisma, {
          actorType: "vendor",
          actorId: vendor.id,
          action: "vendor.registered",
          entityType: "VENDOR",
          entityId: vendor.id,
          metadata: { email: vendor.email, status: vendor.status },
        });

        await prisma.emailVerificationToken.delete({ where: { token } }).catch(() => {});

        res.status(201).json({ success: true, message: "Vendor registered and pending approval", vendor: { id: vendor.id, companyName: vendor.companyName, status: vendor.status } });
        return;
      }

      res.status(400).json({ error: "Invalid verification payload" });
      return;
    }

    // Existing link-based verification for previously-created accounts
    if (verificationRecord.userId) {
      await prisma.user.update({ where: { id: verificationRecord.userId }, data: { emailVerifiedAt: new Date() } });
      // send welcome email after successful verification
      try {
        await sendTransactionalEmail({
          to: verificationRecord.email,
          subject: "Welcome to Solar Compare",
          body: `Welcome! Your email has been verified.`,
          html: welcomeTemplate((await prisma.user.findUnique({ where: { id: verificationRecord.userId } }))?.fullName || "User"),
        });
      } catch (err) {
        console.error("Failed to send welcome email:", err);
      }
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

    let account:
      | { id: string; fullName?: string | null; ownerName?: string | null; name?: string | null; email: string }
      | null = null;

    if (accountType === "user") {
      account = await prisma.user.findUnique({ where: { email }, select: { id: true, fullName: true, email: true } });
    } else if (accountType === "vendor") {
      account = await prisma.vendor.findUnique({ where: { email }, select: { id: true, ownerName: true, email: true } });
    } else {
      account = await prisma.admin.findUnique({ where: { email }, select: { id: true, name: true, email: true } });
    }

    if (!account) {
      res.status(404).json({ error: accountType === "user" ? "User not found" : accountType === "vendor" ? "Vendor not found" : "Admin not found" });
      return;
    }

    const recentResetRequest = await prisma.emailVerificationToken.findFirst({
      where: {
        email,
        purpose: "PASSWORD_RESET",
        usedAt: null,
        createdAt: { gte: new Date(Date.now() - 1000 * 60 * 2) },
      },
      orderBy: { createdAt: "desc" },
    });

    if (recentResetRequest) {
      res.status(429).json({ error: "Please wait a few minutes before requesting another verification code." });
      return;
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const hashedOtp = await hashPassword(otp);
    const token = createOneTimeToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

    await prisma.emailVerificationToken.create({
      data: {
        token,
        email,
        purpose: "PASSWORD_RESET",
        otpHash: hashedOtp,
        userId: accountType === "user" ? account.id : undefined,
        vendorId: accountType === "vendor" ? account.id : undefined,
        adminId: accountType === "admin" ? account.id : undefined,
        expiresAt,
      },
    });

    const recipientName = accountType === "user"
      ? account.fullName || account.email
      : accountType === "vendor"
        ? account.ownerName || account.email
        : account.name || account.email;

    await sendTransactionalEmail({
      to: email,
      subject: "Reset your password",
      body: `Your verification code is ${otp}. It expires in 10 minutes.`,
      html: otpTemplate(recipientName, otp, 10),
    });

    const respPayload: any = { success: true, message: "Verification code sent" };
    if (process.env.NODE_ENV === "test") respPayload.debugOtp = otp;
    res.status(200).json(respPayload);
  } catch (error) {
    console.error("Request password reset error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyPasswordResetOtp = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, otp, accountType } = req.body as { email?: string; otp?: string; accountType?: "user" | "vendor" | "admin" };

    if (!email || !otp || !accountType) {
      res.status(400).json({ error: "Email, OTP, and account type are required" });
      return;
    }

    const resetRecord = await prisma.emailVerificationToken.findFirst({
      where: {
        email,
        purpose: "PASSWORD_RESET",
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!resetRecord) {
      res.status(400).json({ error: "Invalid or expired verification code" });
      return;
    }

    if ((resetRecord.attempts || 0) >= 5) {
      res.status(429).json({ error: "Too many invalid attempts. Request a new code." });
      return;
    }

    const isOtpValid = resetRecord.otpHash ? await comparePassword(otp, resetRecord.otpHash) : false;

    if (!isOtpValid) {
      await prisma.emailVerificationToken.update({
        where: { id: resetRecord.id },
        data: { attempts: { increment: 1 } },
      });
      res.status(401).json({ error: "Invalid verification code" });
      return;
    }

    await prisma.emailVerificationToken.update({
      where: { id: resetRecord.id },
      data: { attempts: 0 },
    });

    res.status(200).json({ success: true, message: "Verification code verified" });
  } catch (error) {
    console.error("Verify password reset OTP error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const completePasswordReset = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword, accountType } = req.body as {
      email?: string;
      otp?: string;
      newPassword?: string;
      accountType?: "user" | "vendor" | "admin";
    };

    if (!email || !otp || !newPassword || !accountType) {
      res.status(400).json({ error: "Email, OTP, password, and account type are required" });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters long" });
      return;
    }

    const resetRecord = await prisma.emailVerificationToken.findFirst({
      where: {
        email,
        purpose: "PASSWORD_RESET",
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!resetRecord) {
      res.status(400).json({ error: "Invalid or expired verification code" });
      return;
    }

    if ((resetRecord.attempts || 0) >= 5) {
      res.status(429).json({ error: "Too many invalid attempts. Request a new code." });
      return;
    }

    const isOtpValid = resetRecord.otpHash ? await comparePassword(otp, resetRecord.otpHash) : false;
    if (!isOtpValid) {
      await prisma.emailVerificationToken.update({
        where: { id: resetRecord.id },
        data: { attempts: { increment: 1 } },
      });
      res.status(401).json({ error: "Invalid verification code" });
      return;
    }

    const hashedPassword = await hashPassword(newPassword);

    if (accountType === "user") {
      await prisma.user.update({ where: { email }, data: { password: hashedPassword } });
    } else if (accountType === "vendor") {
      await prisma.vendor.update({ where: { email }, data: { password: hashedPassword } });
    } else {
      await prisma.admin.update({ where: { email }, data: { password: hashedPassword } });
    }

    await prisma.emailVerificationToken.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date(), attempts: 0 },
    });

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Complete password reset error:", error);
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

export const resendVerificationOtp = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { token } = req.body as { token?: string };

    if (!token) {
      res.status(400).json({ error: "Token is required" });
      return;
    }

    const record = await prisma.emailVerificationToken.findUnique({ where: { token } });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      res.status(400).json({ error: "Invalid or expired token" });
      return;
    }

    if ((record.resendCount || 0) >= 3) {
      res.status(429).json({ error: "Resend limit reached" });
      return;
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const hashedOtp = await hashPassword(otp);

    await prisma.emailVerificationToken.update({
      where: { token },
      data: { otpHash: hashedOtp, resendCount: { increment: 1 }, expiresAt: new Date(Date.now() + 1000 * 60 * 10) },
    });

    // Send OTP email
    const payload = record.payload && typeof record.payload === "object" ? (record.payload as Record<string, unknown>) : null;
    const recipientName = typeof payload?.fullName === "string" ? payload.fullName : typeof payload?.ownerName === "string" ? payload.ownerName : record.email;

    await sendTransactionalEmail({
      to: record.email,
      subject: "Verify Your Email Address",
      body: `Your verification code is ${otp}. It expires in 10 minutes.`,
      html: otpTemplate(recipientName, otp, 10),
    });

    await createAuditLog(prisma, {
      actorType: "system",
      action: "email_otp.resent",
      entityType: record.vendorId ? "VENDOR" : "USER",
      entityId: record.vendorId || record.userId || undefined,
      metadata: { email: record.email },
    });

    res.status(200).json({ success: true, message: "Verification code resent" });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};