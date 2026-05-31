import nodemailer from "nodemailer";
import {getEnv} from "./env";

const env = getEnv();

let transporter: nodemailer.Transporter | null = null;

function initTransporter() {
  if (transporter) return transporter;

  const host = env.SMTP_HOST;
  const port = Number(env.SMTP_PORT || 587);
  const secure = String(env.SMTP_SECURE || "false") === "true";
  const user = env.SMTP_USER;
  const pass = env.SMTP_PASS;

  if (!host || !user || !pass) {
    transporter = null;
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  return transporter;
}

function baseHtmlTemplate({ title, preheader, bodyHtml, ctaText, ctaHref }: { title: string; preheader?: string; bodyHtml: string; ctaText?: string; ctaHref?: string; }) {
  const logo = env.FRONTEND_URL ? `${env.FRONTEND_URL.replace(/\/$/, "")}/icon.png` : undefined;

  return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body { margin:0; padding:0; font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; background:#f8fafc; }
      .container { max-width:640px; margin:0 auto; padding:24px; }
      .card { background:#ffffff; border-radius:16px; padding:28px; border:1px solid #e6eef8; }
      .header { display:flex; align-items:center; gap:12px; }
      .logo { width:48px; height:48px; object-fit:contain; }
      .title { font-size:20px; margin:0; color:#0f172a; }
      .pre { color:#64748b; font-size:13px; margin-top:8px; }
      .body { color:#334155; font-size:15px; line-height:1.6; margin-top:18px; }
      .cta { display:inline-block; margin-top:20px; background:#0f172a; color:#fff; padding:12px 18px; border-radius:999px; text-decoration:none; font-weight:700; }
      .footer { margin-top:24px; border-top:1px solid #eef2f7; padding-top:16px; color:#94a3b8; font-size:13px; }
      @media (max-width:480px) { .card { padding:18px; border-radius:12px; } .title { font-size:18px; } }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="header">
          ${logo ? `<img src="${logo}" alt="logo" class="logo" />` : ""}
          <div>
            <h1 class="title">${title}</h1>
            ${preheader ? `<div class="pre">${preheader}</div>` : ""}
          </div>
        </div>
        <div class="body">${bodyHtml}</div>
        ${ctaText && ctaHref ? `<a class="cta" href="${ctaHref}">${ctaText}</a>` : ""}
        <div class="footer">If you need help, contact us at <a href="mailto:${env.ADMIN_EMAIL}" style="color:inherit">${env.ADMIN_EMAIL}</a>. © ${new Date().getFullYear()} Solar Compare by SAFWE ENERGY</div>
      </div>
    </div>
  </body>
  </html>
  `;
}

export async function sendEmail({ to, subject, text, html }: { to: string; subject: string; text?: string; html?: string; }) {
  const t = initTransporter();
  if (!t) {
    console.info(`[email][dry] to=${to} subject=${subject} text=${text}`);
    return { success: false, error: "No SMTP configured" };
  }

  const message = {
    from: env.EMAIL_FROM || env.SMTP_USER,
    to,
    subject,
    text: text || subject,
    html,
  };

  const maxAttempts = 3;
  let lastErr: unknown = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await t.sendMail(message);
      return { success: true };
    } catch (err) {
      lastErr = err;
      console.warn(`[email] attempt ${attempt} failed`, err);
      if (attempt === maxAttempts) break;
      await new Promise((r) => setTimeout(r, attempt * 500));
    }
  }

  console.error("Email send failed", lastErr);
  return { success: false, error: (lastErr as any)?.message || String(lastErr) };
}

export function verificationTemplate(name: string, link: string) {
  const body = `<p>Hi ${name},</p><p>Please confirm your email address by clicking the button below. This secure link will expire shortly.</p>`;
  return baseHtmlTemplate({ title: "Verify your email", preheader: "Confirm your email to activate your account", bodyHtml: body, ctaText: "Verify email", ctaHref: link });
}

export function otpTemplate(name: string, otp: string, expiryMinutes = 10) {
  const body = `<p>Hi ${name},</p>
  <p>Your verification code is:</p>
  <p style="font-size:28px; font-weight:700; letter-spacing:4px;">${otp}</p>
  <p>This code will expire in ${expiryMinutes} minutes. Do not share this code with anyone.</p>
  <p>If you did not request this, please ignore this message.</p>`;

  return baseHtmlTemplate({ title: "Verify your email", preheader: "Enter the verification code to continue", bodyHtml: body });
}

export function resetTemplate(name: string, link: string) {
  const body = `<p>Hi ${name},</p><p>We received a request to reset your password. Click the button below to set a new password. If you didn't request this, ignore this email.</p>`;
  return baseHtmlTemplate({ title: "Reset your password", preheader: "Secure password reset", bodyHtml: body, ctaText: "Reset password", ctaHref: link });
}

export function welcomeTemplate(name: string) {
  const body = `<p>Hi ${name},</p><p>Welcome to Solar Compare — we're excited to have you. Explore quotes, vendor matches, and premium solar products.</p>`;
  return baseHtmlTemplate({ title: "Welcome to Solar Compare", preheader: "Thanks for joining", bodyHtml: body, ctaText: "Get started", ctaHref: env.FRONTEND_URL || "/" });
}

export function vendorApprovalTemplate(companyName: string) {
  const body = `<p>Hi ${companyName},</p><p>Congratulations — your vendor application has been approved. You can now log in and complete your profile.</p>`;
  return baseHtmlTemplate({ title: "Vendor application approved", preheader: "Your vendor account is live", bodyHtml: body, ctaText: "Go to dashboard", ctaHref: `${env.FRONTEND_URL}/login` });
}

export function vendorRejectionTemplate(companyName: string, reason?: string) {
  const body = `<p>Hi ${companyName},</p><p>We're sorry — your vendor application was not approved.${reason ? ` Reason: ${reason}` : ""}</p>`;
  return baseHtmlTemplate({ title: "Vendor application update", preheader: "Application update", bodyHtml: body, ctaText: "Contact support", ctaHref: `mailto:${env.ADMIN_EMAIL}` });
}

export function adminNotificationTemplate(subject: string, message: string) {
  const body = `<p>${message}</p>`;
  return baseHtmlTemplate({ title: subject, preheader: subject, bodyHtml: body });
}

export function quoteNotificationTemplate(payloadSummary: string) {
  const body = `<p>A new quote or inquiry was submitted:</p><p style=\"white-space:pre-line\">${payloadSummary}</p>`;
  return baseHtmlTemplate({ title: "New quote request", preheader: "New lead or quote captured", bodyHtml: body, ctaText: "Open dashboard", ctaHref: `${env.FRONTEND_URL}/admin/leads` });
}

export default {
  initTransporter,
  sendEmail,
  verificationTemplate,
  resetTemplate,
  welcomeTemplate,
  vendorApprovalTemplate,
  vendorRejectionTemplate,
  adminNotificationTemplate,
  quoteNotificationTemplate,
  otpTemplate,
};
