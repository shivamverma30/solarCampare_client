import crypto from "crypto";
import fs from "fs";
import path from "path";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export type StoredFileResult = {
  provider: "CLOUDINARY" | "LOCAL";
  publicId: string;
  url: string;
  secureUrl?: string;
  originalName?: string;
  mimeType?: string;
  sizeInBytes?: number;
  width?: number;
  height?: number;
  checksum?: string;
};

function getExtensionFromMime(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/avif":
      return "avif";
    case "application/pdf":
      return "pdf";
    case "application/msword":
      return "doc";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "docx";
    default:
      return "bin";
  }
}

function buildChecksum(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

async function storeToLocal(buffer: Buffer, fileName: string, mimeType: string): Promise<StoredFileResult> {
  const uploadDirectory = path.join(process.cwd(), "uploads");
  fs.mkdirSync(uploadDirectory, { recursive: true });

  const safeBaseName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const publicId = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}-${safeBaseName}`;
  const extension = getExtensionFromMime(mimeType);
  const filePath = path.join(uploadDirectory, `${publicId}.${extension}`);

  await fs.promises.writeFile(filePath, buffer);

  const relativeUrl = `/uploads/${publicId}.${extension}`;

  return {
    provider: "LOCAL",
    publicId,
    url: relativeUrl,
    secureUrl: relativeUrl,
    originalName: fileName,
    mimeType,
    sizeInBytes: buffer.byteLength,
    checksum: buildChecksum(buffer),
  };
}

async function storeToCloudinary(buffer: Buffer, fileName: string, mimeType: string): Promise<StoredFileResult | null> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = process.env.CLOUDINARY_FOLDER || "solar-platform";
  const publicIdSeed = `${folder}/${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
  const signaturePayload = `folder=${folder}&public_id=${publicIdSeed}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(signaturePayload).digest("hex");

  const formData = new FormData();
  formData.append("file", new Blob([buffer], { type: mimeType }), fileName);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("folder", folder);
  formData.append("public_id", publicIdSeed);
  formData.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    public_id: string;
    secure_url?: string;
    url?: string;
    format?: string;
    bytes?: number;
    width?: number;
    height?: number;
  };

  return {
    provider: "CLOUDINARY",
    publicId: payload.public_id,
    url: payload.url || payload.secure_url || "",
    secureUrl: payload.secure_url || payload.url,
    originalName: fileName,
    mimeType,
    sizeInBytes: payload.bytes,
    width: payload.width,
    height: payload.height,
    checksum: buildChecksum(buffer),
  };
}

export async function storeUploadedFile(buffer: Buffer, fileName: string, mimeType: string): Promise<StoredFileResult> {
  if (!allowedMimeTypes.has(mimeType)) {
    throw new Error("Unsupported file type");
  }

  const cloudinaryResult = await storeToCloudinary(buffer, fileName, mimeType);
  if (cloudinaryResult) {
    return cloudinaryResult;
  }

  return storeToLocal(buffer, fileName, mimeType);
}

export function isAllowedUploadMimeType(mimeType: string): boolean {
  return allowedMimeTypes.has(mimeType);
}
