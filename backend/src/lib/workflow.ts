import type { Prisma, PrismaClient, NotificationAudience, NotificationType, AuditEntityType } from "@prisma/client";
import emailService from "./email";

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

export async function sendTransactionalEmail(input: { to: string; subject: string; body: string; html?: string; type?: string; meta?: Record<string, unknown> }): Promise<void> {
  try {
    const html = input.html ?? input.body;

    await emailService.sendEmail({ to: input.to, subject: input.subject, text: input.body, html });
  } catch (err) {
    console.error("sendTransactionalEmail error:", err);
  }
}

export async function safeEmailDispatch(subject: string, body: string): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  if (!adminEmail) {
    console.info(`[email] ${subject}: ${body}`);
    return;
  }

  try {
    const html = emailService.adminNotificationTemplate(subject, body);
    await emailService.sendEmail({ to: adminEmail, subject, text: body, html });
  } catch (err) {
    console.error("safeEmailDispatch error:", err);
  }
}

export const verificationTemplate = emailService.verificationTemplate;
export const resetTemplate = emailService.resetTemplate;
export const welcomeTemplate = emailService.welcomeTemplate;
export const otpTemplate = (name: string, otp: string, mins = 10) => emailService.otpTemplate(name, otp, mins);
export const vendorApprovalTemplate = emailService.vendorApprovalTemplate;
export const vendorRejectionTemplate = emailService.vendorRejectionTemplate;
export const adminNotificationTemplate = emailService.adminNotificationTemplate;
export const quoteNotificationTemplate = emailService.quoteNotificationTemplate;