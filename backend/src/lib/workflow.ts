import nodemailer from "nodemailer";
import type { Prisma, PrismaClient, NotificationAudience, NotificationType, AuditEntityType } from "@prisma/client";

type JsonValue = Prisma.InputJsonValue;

export async function createAuditLog(
  prisma: PrismaClient,
  input: {
    actorType: string;
    actorId?: string;
    action: string;
    entityType: AuditEntityType;
    entityId?: string;
    metadata?: JsonValue;
    createdByAdminId?: string;
  }
) {
  return prisma.auditLog.create({
    data: {
      actorType: input.actorType,
      actorId: input.actorId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata: input.metadata,
      createdByAdminId: input.createdByAdminId,
    },
  });
}

export async function createNotification(
  prisma: PrismaClient,
  input: {
    audience: NotificationAudience;
    type: NotificationType;
    title: string;
    body: string;
    adminId?: string;
    userId?: string;
    vendorId?: string;
    metadata?: JsonValue;
  }
) {
  return prisma.notification.create({
    data: {
      audience: input.audience,
      type: input.type,
      title: input.title,
      body: input.body,
      adminId: input.adminId,
      userId: input.userId,
      vendorId: input.vendorId,
      metadata: input.metadata,
    },
  });
}

function buildEmailHtml(subject: string, body: string): string {
  return `
    <div style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px; color: #0f172a;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 28px;">
        <div style="font-size: 12px; letter-spacing: 0.24em; text-transform: uppercase; color: #b45309; font-weight: 700;">Solar Compare by SAFWE ENERGY</div>
        <h1 style="margin: 16px 0 12px; font-size: 28px; line-height: 1.2;">${subject}</h1>
        <p style="font-size: 15px; line-height: 1.8; color: #334155; white-space: pre-line;">${body}</p>
      </div>
    </div>
  `;
}

export async function sendTransactionalEmail(input: {
  to: string;
  subject: string;
  body: string;
  html?: string;
}): Promise<void> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const adminEmail = process.env.ADMIN_EMAIL || smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass || (!input.to && !adminEmail)) {
    console.info(`[email] to=${input.to} subject=${input.subject}: ${input.body}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const message = {
    from: process.env.SMTP_FROM || smtpUser,
    to: input.to || adminEmail,
    subject: input.subject,
    text: input.body,
    html: input.html || buildEmailHtml(input.subject, input.body),
  };

  const maxAttempts = 3;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await transporter.sendMail(message);
      return;
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) {
        break;
      }
    }
  }

  console.error("Transactional email failed:", lastError);
}

export async function safeEmailDispatch(subject: string, body: string): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

  if (!adminEmail) {
    console.info(`[email] ${subject}: ${body}`);
    return;
  }

  await sendTransactionalEmail({
    to: adminEmail,
    subject,
    body,
  });
}