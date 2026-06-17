import { Resend } from "resend";

// NOTE: No module-level env reads.
// ES module imports are hoisted before dotenv.config() runs in index.ts,
// so all env access happens inside functions at call time.

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (resendClient) return resendClient;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — emails will be skipped");
    return null;
  }
  resendClient = new Resend(apiKey);
  console.info("[email] Resend client ready");
  return resendClient;
}

function getSupportEmail(): string {
  return (
    process.env.ADMIN_EMAIL ||
    process.env.EMAIL_FROM ||
    "support@solarcompare.in"
  );
}

function getAppUrl(): string {
  return (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
}

// ---------------------------------------------------------------------------
// Base HTML template — unchanged from original
// ---------------------------------------------------------------------------

function baseHtmlTemplate({
  title,
  preheader,
  bodyHtml,
  ctaText,
  ctaHref,
}: {
  title: string;
  preheader?: string;
  bodyHtml: string;
  ctaText?: string;
  ctaHref?: string;
}) {
  const supportEmail = getSupportEmail();
  const appUrl = getAppUrl();

  const primaryButton =
    ctaText && ctaHref
      ? `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:22px;">
      <tr>
        <td style="border-radius:999px; background:#0f172a;">
          <a href="${ctaHref}" style="display:inline-block;padding:13px 22px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border:1px solid #0f172a;border-radius:999px;">${ctaText}</a>
        </td>
      </tr>
    </table>`
      : "";

  return `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0;padding:0;background:#eef3f8;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:#eef3f8;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;">
            <tr>
              <td style="padding:0 4px 14px 4px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border-radius:20px;border:1px solid #172033;">
                  <tr>
                    <td style="padding:18px 22px;">
                      <div style="font-size:12px;line-height:1.2;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:#f8fafc;">SOLAR COMPARE</div>
                      <div style="margin-top:4px;font-size:14px;line-height:1.4;color:#cbd5e1;font-weight:600;">by SAFWE ENERGY</div>
                    </td>
                    <td align="right" style="padding:18px 22px;vertical-align:middle;">
                      ${preheader ? `<div style="display:inline-block;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.08);padding:8px 12px;border-radius:999px;color:#e2e8f0;font-size:12px;font-weight:700;">${preheader}</div>` : ""}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 4px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #dbe4ee;border-radius:24px;overflow:hidden;box-shadow:0 22px 60px rgba(15,23,42,0.10);">
                  <tr>
                    <td style="padding:0;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#f8fbff 0%,#ffffff 100%);">
                        <tr>
                          <td style="padding:30px 28px 20px 28px;">
                            <div style="font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#0f766e;">Premium update</div>
                            <h1 style="margin:10px 0 0 0;font-size:28px;line-height:1.15;color:#0f172a;font-weight:800;">${title}</h1>
                            <div style="margin-top:14px;font-size:15px;line-height:1.7;color:#334155;">${bodyHtml}</div>
                            ${primaryButton}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:14px 8px 0 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #dbe4ee;border-radius:18px;">
                  <tr>
                    <td style="padding:16px 20px;color:#64748b;font-size:13px;line-height:1.7;">
                      Need help? Contact <a href="mailto:${supportEmail}" style="color:#0f172a;text-decoration:underline;font-weight:700;">${supportEmail}</a>.<br />
                      Open the platform at <a href="${appUrl}" style="color:#0f172a;text-decoration:underline;font-weight:700;">${appUrl}</a>.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

// ---------------------------------------------------------------------------
// sendEmail — same signature as before, now uses Resend
// ---------------------------------------------------------------------------

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  const client = getResendClient();

  if (!client) {
    console.info(`[email][dry] to=${to} subject=${subject} text=${text}`);
    return { success: false, error: "No email provider configured" };
  }

  const from = process.env.EMAIL_FROM || "no-reply@localhost";

  // TEMPORARY DEBUG — remove after confirming sender value
  console.log("EMAIL_FROM ENV =", process.env.EMAIL_FROM);
  console.log("RESEND FROM =", from);
  console.log("RESEND PAYLOAD =", JSON.stringify({ from, to, subject, html: html ? "[html present]" : undefined, text }));

  const { data, error } = await client.emails.send({
    from,
    to,
    subject,
    html: html || `<pre>${text || subject}</pre>`,
    text: text || subject,
  });

  if (error) {
    console.error(`[email] Resend error — to=${to} subject="${subject}"`, error);
    return { success: false, error: error.message };
  }

  console.info(`[email] sent — id=${data?.id} to=${to} subject="${subject}"`);
  return { success: true };
}

// ---------------------------------------------------------------------------
// Email templates — unchanged from original
// ---------------------------------------------------------------------------

export function verificationTemplate(name: string, link: string) {
  const body = `
    <div style="margin:0 0 14px 0;">Hi ${name},</div>
    <div style="margin:0 0 18px 0;">Please confirm your email address to activate your account. This secure link will expire shortly.</div>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
      <tr>
        <td style="padding:16px;border:1px solid #dbe4ee;border-radius:16px;background:#f8fbff;color:#334155;">Security tip: only verify from a trusted device.</td>
      </tr>
    </table>`;
  return baseHtmlTemplate({
    title: "Verify your email",
    preheader: "Confirm your email to activate your account",
    bodyHtml: body,
    ctaText: "Verify email",
    ctaHref: link,
  });
}

export function otpTemplate(name: string, otp: string, expiryMinutes = 10) {
  const body = `
    <div style="margin:0 0 12px 0;">Hi ${name},</div>
    <div style="margin:0 0 18px 0;color:#475569;">Use the verification code below to continue.</div>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:18px 0 14px 0;">
      <tr>
        <td align="center">
          <div style="display:inline-block;background:#0f172a;border:1px solid #0f172a;padding:22px 34px;border-radius:18px;box-shadow:0 14px 30px rgba(15,23,42,0.20);text-align:center;min-width:220px;">
            <div style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#94a3b8;font-weight:700;">One-time passcode</div>
            <div style="margin-top:10px;font-family:Arial,Helvetica,sans-serif;font-size:34px;font-weight:800;letter-spacing:8px;color:#ffffff;">${otp}</div>
            <div style="margin-top:8px;font-size:12px;color:#cbd5e1;">Expires in ${expiryMinutes} minutes</div>
          </div>
        </td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-top:10px;">
      <tr>
        <td style="padding:16px;border-radius:16px;border:1px solid #dbe4ee;background:#f8fbff;color:#475569;font-size:13px;line-height:1.7;">Security notice: Never share this code with anyone. If you did not request it, you can safely ignore this email.</td>
      </tr>
    </table>`;
  return baseHtmlTemplate({
    title: "Verify your email",
    preheader: "Enter the verification code to continue",
    bodyHtml: body,
  });
}

export function resetTemplate(name: string, link: string) {
  const body = `
    <div style="margin:0 0 12px 0;">Hi ${name},</div>
    <div style="margin:0 0 18px 0;">We received a password reset request for your account. Use the secure button below to create a new password.</div>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-top:10px;">
      <tr>
        <td style="padding:16px;border:1px solid #dbe4ee;border-radius:16px;background:#fff7ed;color:#9a3412;font-size:13px;line-height:1.7;">If you didn't request this, you can ignore this email. Your password will remain unchanged.</td>
      </tr>
    </table>`;
  return baseHtmlTemplate({
    title: "Reset your password",
    preheader: "Secure password reset",
    bodyHtml: body,
    ctaText: "Reset password",
    ctaHref: link,
  });
}

export function welcomeTemplate(name: string) {
  const appUrl = getAppUrl();
  const body = `
    <div style="margin:0 0 12px 0;">Hi ${name},</div>
    <div style="margin:0 0 18px 0;">Welcome to Solar Compare. You now have access to a premium solar marketplace built to help you compare, discover and connect faster.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0 8px 0;">
      <tr>
        <td style="padding:14px 16px;border:1px solid #dbe4ee;border-radius:16px;background:#f8fbff;">
          <div style="font-size:13px;font-weight:700;color:#0f172a;">Platform benefits</div>
          <div style="margin-top:8px;color:#475569;font-size:14px;line-height:1.7;">Verified vendors, quick quotations, transparent comparisons, and a smoother dashboard experience.</div>
        </td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-top:12px;">
      <tr>
        <td style="padding:12px;border-radius:16px;background:#ecfeff;border:1px solid #a5f3fc;color:#155e75;">Support available whenever you need help with onboarding, solar choices or account setup.</td>
      </tr>
    </table>`;
  return baseHtmlTemplate({
    title: "Welcome to Solar Compare",
    preheader: "Thanks for joining",
    bodyHtml: body,
    ctaText: "Explore platform",
    ctaHref: appUrl,
  });
}

export function vendorApprovalTemplate(companyName: string) {
  const appUrl = getAppUrl();
  const body = `
    <div style="margin:0 0 12px 0;">Hi ${companyName},</div>
    <div style="margin:0 0 18px 0;">Congratulations — your vendor profile is approved and ready to use.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
      <tr>
        <td style="padding:14px 16px;border-radius:16px;background:#ecfdf5;border:1px solid #bbf7d0;color:#166534;">Your dashboard is now available for leads, products and notifications.</td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:14px 16px;border-radius:16px;background:#f8fbff;border:1px solid #dbe4ee;color:#475569;line-height:1.7;">Next steps: complete your profile, review your leads and keep your service details up to date.</td>
      </tr>
    </table>`;
  return baseHtmlTemplate({
    title: "Vendor application approved",
    preheader: "Your vendor account is live",
    bodyHtml: body,
    ctaText: "Open dashboard",
    ctaHref: `${appUrl}/vendor/dashboard`,
  });
}

export function vendorRejectionTemplate(companyName: string, reason?: string) {
  const supportEmail = getSupportEmail();
  const body = `
    <div style="margin:0 0 12px 0;">Hi ${companyName},</div>
    <div style="margin:0 0 18px 0;">Thank you for applying to join Solar Compare. After review, we're unable to approve the application at this time.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
      <tr>
        <td style="padding:14px 16px;border-radius:16px;background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;line-height:1.7;">${reason ? `Reason: ${reason}` : "Please review your details and supporting information before reapplying."}</td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:14px 16px;border-radius:16px;background:#f8fbff;border:1px solid #dbe4ee;color:#475569;line-height:1.7;">You can reapply after updating the relevant information or contact support for guidance.</td>
      </tr>
    </table>`;
  return baseHtmlTemplate({
    title: "Vendor application update",
    preheader: "Application update",
    bodyHtml: body,
    ctaText: "Contact support",
    ctaHref: `mailto:${supportEmail}`,
  });
}

export function adminNotificationTemplate(subject: string, message: string) {
  const body = `<div style="padding:14px 16px;border-radius:16px;background:#f8fbff;border:1px solid #dbe4ee;color:#334155;line-height:1.7;">${message}</div>`;
  return baseHtmlTemplate({ title: subject, preheader: subject, bodyHtml: body });
}

export function quoteNotificationTemplate(payloadSummary: string) {
  const appUrl = getAppUrl();
  const body = `
    <div style="margin:0 0 12px 0;">A new inquiry or quote was submitted.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:14px 16px;border-radius:16px;background:#f8fbff;border:1px solid #dbe4ee;color:#334155;white-space:pre-line;line-height:1.7;">${payloadSummary}</td>
      </tr>
    </table>`;
  return baseHtmlTemplate({
    title: "New quote request",
    preheader: "New lead or quote captured",
    bodyHtml: body,
    ctaText: "Open dashboard",
    ctaHref: `${appUrl}/admin/leads`,
  });
}

export default {
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
