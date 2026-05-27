import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";
import { storeUploadedFile } from "../lib/file-storage";

export const createUploadMetadata = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      ownerType,
      ownerId,
      purpose,
      provider,
      publicId,
      url,
      secureUrl,
      originalName,
      mimeType,
      sizeInBytes,
      width,
      height,
      checksum,
      metadata,
      quoteRequestId,
    } = req.body as Record<string, unknown>;

    if (!ownerType || !url) {
      res.status(400).json({ error: "ownerType and url are required" });
      return;
    }

    const uploadAsset = await prisma.uploadAsset.create({
      data: {
        ownerType: String(ownerType),
        ownerId: ownerId ? String(ownerId) : null,
        purpose: (purpose as never) || "OTHER",
        provider: (provider as never) || "LOCAL",
        publicId: publicId ? String(publicId) : null,
        url: String(url),
        secureUrl: secureUrl ? String(secureUrl) : null,
        originalName: originalName ? String(originalName) : null,
        mimeType: mimeType ? String(mimeType) : null,
        sizeInBytes: typeof sizeInBytes === "number" ? sizeInBytes : sizeInBytes ? Number(sizeInBytes) : null,
        width: typeof width === "number" ? width : width ? Number(width) : null,
        height: typeof height === "number" ? height : height ? Number(height) : null,
        checksum: checksum ? String(checksum) : null,
        metadata: metadata as never,
        quoteRequestId: quoteRequestId ? String(quoteRequestId) : null,
        createdByAdminId: req.adminId || null,
      },
    });

    res.status(201).json({ success: true, uploadAsset });
  } catch (error) {
    console.error("Create upload metadata error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const uploadDocumentFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "File is required" });
      return;
    }

    const ownerType = String(req.body.ownerType || "OTHER");
    const ownerId = req.body.ownerId ? String(req.body.ownerId) : null;
    const purpose = String(req.body.purpose || "OTHER");
    const quoteRequestId = req.body.quoteRequestId ? String(req.body.quoteRequestId) : null;

    const storedFile = await storeUploadedFile(req.file.buffer, req.file.originalname, req.file.mimetype);

    const uploadAsset = await prisma.uploadAsset.create({
      data: {
        ownerType,
        ownerId,
        purpose: purpose as never,
        provider: storedFile.provider as never,
        publicId: storedFile.publicId,
        url: storedFile.url,
        secureUrl: storedFile.secureUrl,
        originalName: storedFile.originalName,
        mimeType: storedFile.mimeType,
        sizeInBytes: storedFile.sizeInBytes,
        checksum: storedFile.checksum,
        metadata: {
          source: "multipart",
          fieldName: req.file.fieldname,
        },
        quoteRequestId,
        createdByAdminId: req.adminId || null,
        userId: req.userId || null,
        vendorId: req.vendorId || null,
      },
    });

    res.status(201).json({ success: true, uploadAsset });
  } catch (error) {
    console.error("Upload document file error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Internal server error" });
  }
};

export const listUploadMetadata = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uploads = await prisma.uploadAsset.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    res.status(200).json({ success: true, uploads });
  } catch (error) {
    console.error("List upload metadata error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
