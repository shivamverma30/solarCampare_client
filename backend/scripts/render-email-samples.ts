import fs from 'fs';
import path from 'path';

// Ensure env for template rendering
const previewFrontendUrl = process.env.FRONTEND_URL;
if (!previewFrontendUrl) {
  throw new Error('Missing required environment variable: FRONTEND_URL');
}

if (!process.env.ADMIN_EMAIL) {
  throw new Error('Missing required environment variable: ADMIN_EMAIL');
}

process.env.EMAIL_LOGO_URL = process.env.EMAIL_LOGO_URL || '';

import { otpTemplate, welcomeTemplate, vendorApprovalTemplate, vendorRejectionTemplate, resetTemplate } from '../src/lib/email';

const outDir = path.resolve(process.cwd(), 'tmp-email-previews');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const samples: Array<{ name: string; html: string }> = [];

samples.push({ name: 'otp.html', html: otpTemplate('Test User', '123456', 10) });
samples.push({ name: 'welcome.html', html: welcomeTemplate('Test User') });
samples.push({ name: 'vendor-approved.html', html: vendorApprovalTemplate('TestCo') });
samples.push({ name: 'vendor-rejected.html', html: vendorRejectionTemplate('TestCo', 'Insufficient documentation') });
samples.push({ name: 'reset.html', html: resetTemplate('Test User', `${previewFrontendUrl}/reset-password?token=abc123&type=user`) });

for (const s of samples) {
  const dest = path.join(outDir, s.name);
  fs.writeFileSync(dest, s.html, 'utf8');
  console.log('Wrote', dest);
}

console.log('Preview files written to', outDir);
