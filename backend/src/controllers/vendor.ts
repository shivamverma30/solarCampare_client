import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";
import { createAuditLog, createNotification, safeEmailDispatch, sendTransactionalEmail, vendorApprovalTemplate, vendorRejectionTemplate } from "../lib/workflow";

const vendorSafeSelect = {
  id: true,
  companyName: true,
  ownerName: true,
  serviceArea: true,
  city: true,
  state: true,
  pincode: true,
  logoUrl: true,
  businessType: true,
  experience: true,
  services: true,
  status: true,
  createdAt: true,
} as const;

function calculateMatchScore(input: { pincode?: string; city?: string; state?: string }, vendor: { serviceArea: string; serviceAreas?: Array<{ pincode: string; city?: string | null; state?: string | null; isPrimary: boolean; coverageRank: number }> }) {
  let score = 0;

  const normalizedPincode = input.pincode?.trim();
  const normalizedCity = input.city?.trim().toLowerCase();
  const normalizedState = input.state?.trim().toLowerCase();

  const serviceAreas = vendor.serviceAreas || [];

  const exactPincode = normalizedPincode
    ? serviceAreas.find((serviceArea) => serviceArea.pincode.trim() === normalizedPincode)
    : undefined;

  if (exactPincode) {
    score += 100 + (exactPincode.isPrimary ? 10 : 0) + Math.max(0, 20 - exactPincode.coverageRank);
  }

  const cityMatch = normalizedCity
    ? serviceAreas.find((serviceArea) => serviceArea.city?.trim().toLowerCase() === normalizedCity)
    : undefined;

  if (cityMatch) {
    score += 80 + (cityMatch.isPrimary ? 5 : 0);
  }

  const stateMatch = normalizedState
    ? serviceAreas.find((serviceArea) => serviceArea.state?.trim().toLowerCase() === normalizedState)
    : undefined;

  if (stateMatch) {
    score += 60;
  }

  const textArea = vendor.serviceArea.toLowerCase();

  if (normalizedPincode && textArea.includes(normalizedPincode.toLowerCase())) {
    score += 25;
  }

  if (normalizedCity && textArea.includes(normalizedCity)) {
    score += 20;
  }

  if (normalizedState && textArea.includes(normalizedState)) {
    score += 10;
  }

  return score;
}

export const matchVendorsByPincode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pincode, city, state } = req.query as { pincode?: string; city?: string; state?: string };

    if (!pincode && !city && !state) {
      res.status(400).json({ error: "At least one location field is required" });
      return;
    }

    const vendors = await prisma.vendor.findMany({
      where: { status: "APPROVED" },
      select: {
        id: true,
        companyName: true,
        ownerName: true,
        serviceArea: true,
        businessType: true,
        experience: true,
        services: true,
        createdAt: true,
        serviceAreas: {
          select: {
            pincode: true,
            city: true,
            state: true,
            isPrimary: true,
            coverageRank: true,
          },
        },
      },
    });

    const rankedVendors = vendors
      .map((vendor) => ({
        ...vendor,
        matchScore: calculateMatchScore({ pincode, city, state }, vendor),
      }))
      .filter((vendor) => vendor.matchScore > 0)
      .sort((left, right) => {
        if (right.matchScore !== left.matchScore) return right.matchScore - left.matchScore;
        if (right.experience !== left.experience) return right.experience - left.experience;
        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      });

    res.status(200).json({ success: true, vendors: rankedVendors });
  } catch (error) {
    console.error("Match vendors error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const listPublicVendors = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vendors = await prisma.vendor.findMany({
      where: { status: "APPROVED" },
      select: vendorSafeSelect,
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ success: true, vendors });
  } catch (error) {
    console.error("List public vendors error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const listAdminVendors = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vendors = await prisma.vendor.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        documents: true,
        approvedByAdmin: { select: { id: true, name: true, email: true } },
        rejectedByAdmin: { select: { id: true, name: true, email: true } },
        statusLogs: true,
      },
    });

    res.status(200).json({ success: true, vendors });
  } catch (error) {
    console.error("List admin vendors error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addAdminNoteToVendor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.adminId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const { note } = req.body as { note?: string };

    if (!note) {
      res.status(400).json({ error: "Note is required" });
      return;
    }

    const vendor = await prisma.vendor.findUnique({ where: { id } });
    if (!vendor) {
      res.status(404).json({ error: "Vendor not found" });
      return;
    }

    const created = await prisma.adminInternalNote.create({
      data: {
        entityType: "VENDOR",
        entityId: id,
        note,
        createdByAdminId: req.adminId,
      },
    });

    await createAuditLog(prisma, {
      actorType: "admin",
      actorId: req.adminId,
      action: "vendor.internal_note.added",
      entityType: "VENDOR",
      entityId: id,
      metadata: { note },
      createdByAdminId: req.adminId,
    });

    res.status(201).json({ success: true, note: created });
  } catch (error) {
    console.error("Add admin note error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getVendorById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findFirst({
      where: { id, status: "APPROVED" },
      select: {
        ...vendorSafeSelect,
        documents: {
          select: {
            id: true,
            documentName: true,
            fileType: true,
            createdAt: true,
          },
        },
      },
    });

    if (!vendor) {
      res.status(404).json({ error: "Vendor not found" });
      return;
    }

    res.status(200).json({ success: true, vendor });
  } catch (error) {
    console.error("Get vendor error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const approveVendor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.adminId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const { note } = req.body;

    const vendor = await prisma.vendor.findUnique({ where: { id } });

    if (!vendor) {
      res.status(404).json({ error: "Vendor not found" });
      return;
    }

    const updated = await prisma.vendor.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
        approvedByAdminId: req.adminId,
        rejectedAt: null,
        rejectionReason: null,
      },
    });

    await prisma.vendorStatusLog.create({
      data: {
        vendorId: vendor.id,
        previousStatus: vendor.status,
        newStatus: "APPROVED",
        note: note || "Vendor approved",
        actorAdminId: req.adminId,
      },
    });

    await createNotification(prisma, {
      audience: "VENDOR",
      type: "VENDOR_APPROVED",
      title: "Vendor approved",
      body: `Your vendor account ${vendor.companyName} has been approved.`,
      vendorId: vendor.id,
      metadata: { vendorId: vendor.id, status: updated.status },
    });
    // send email to vendor
    try {
      await sendTransactionalEmail({
        to: vendor.email,
        subject: "Your vendor application has been approved",
        body: `Congratulations ${vendor.companyName}, your vendor application is approved.`,
        html: vendorApprovalTemplate(vendor.companyName),
      });
    } catch (err) {
      console.error("Failed to send vendor approval email:", err);
    }

    await safeEmailDispatch(
      "Vendor approved",
      `${vendor.companyName} (${vendor.email}) was approved by superadmin.`
    );

    await createAuditLog(prisma, {
      actorType: "admin",
      actorId: req.adminId,
      action: "vendor.approved",
      entityType: "VENDOR",
      entityId: vendor.id,
      metadata: { vendorId: vendor.id, note },
      createdByAdminId: req.adminId,
    });

    res.status(200).json({ success: true, vendor: updated });
  } catch (error) {
    console.error("Approve vendor error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const rejectVendor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.adminId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const { reason } = req.body;

    const vendor = await prisma.vendor.findUnique({ where: { id } });

    if (!vendor) {
      res.status(404).json({ error: "Vendor not found" });
      return;
    }

    const updated = await prisma.vendor.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectedAt: new Date(),
        rejectedByAdminId: req.adminId,
        rejectionReason: reason || "Rejected by superadmin",
      },
    });

    await prisma.vendorStatusLog.create({
      data: {
        vendorId: vendor.id,
        previousStatus: vendor.status,
        newStatus: "REJECTED",
        note: reason || "Vendor rejected",
        actorAdminId: req.adminId,
      },
    });

    await createNotification(prisma, {
      audience: "VENDOR",
      type: "VENDOR_REJECTED",
      title: "Vendor application update",
      body: `Your vendor account ${vendor.companyName} has been rejected.`,
      vendorId: vendor.id,
      metadata: { vendorId: vendor.id, reason },
    });

    // send email to vendor with rejection reason
    try {
      await sendTransactionalEmail({
        to: vendor.email,
        subject: "Your vendor application update",
        body: `We're sorry — your vendor application has been rejected.${reason ? ` Reason: ${reason}` : ""}`,
        html: vendorRejectionTemplate(vendor.companyName, reason),
      });
    } catch (err) {
      console.error("Failed to send vendor rejection email:", err);
    }

    await safeEmailDispatch(
      "Vendor rejected",
      `${vendor.companyName} (${vendor.email}) was rejected by superadmin.`
    );

    await createAuditLog(prisma, {
      actorType: "admin",
      actorId: req.adminId,
      action: "vendor.rejected",
      entityType: "VENDOR",
      entityId: vendor.id,
      metadata: { vendorId: vendor.id, reason },
      createdByAdminId: req.adminId,
    });

    res.status(200).json({ success: true, vendor: updated });
  } catch (error) {
    console.error("Reject vendor error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMyVendorProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendorId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const vendor = await prisma.vendor.findUnique({
      where: { id: req.vendorId },
      include: {
        documents: true,
        serviceAreas: {
          orderBy: [{ isPrimary: "desc" }, { coverageRank: "asc" }, { createdAt: "desc" }],
        },
      },
    });

    if (!vendor) {
      res.status(404).json({ error: "Vendor not found" });
      return;
    }

    res.status(200).json({ success: true, vendor });
  } catch (error) {
    console.error("Get my vendor profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMyVendorProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendorId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const {
      ownerName,
      companyName,
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
        ...(ownerName !== undefined && { ownerName }),
        ...(companyName !== undefined && { companyName }),
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
    });

    res.status(200).json({ success: true, message: "Profile updated successfully", vendor });
  } catch (error) {
    console.error("Update my vendor profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const listMyServiceAreas = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendorId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const serviceAreas = await prisma.vendorServiceArea.findMany({
      where: { vendorId: req.vendorId },
      orderBy: [{ isPrimary: "desc" }, { coverageRank: "asc" }, { createdAt: "desc" }],
    });

    res.status(200).json({ success: true, serviceAreas });
  } catch (error) {
    console.error("List service areas error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addMyServiceArea = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendorId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { pincode, city, state, district, isPrimary, coverageRank } = req.body;

    if (!pincode) {
      res.status(400).json({ error: "pincode is required" });
      return;
    }

    if (isPrimary) {
      await prisma.vendorServiceArea.updateMany({
        where: { vendorId: req.vendorId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const serviceArea = await prisma.vendorServiceArea.create({
      data: {
        vendorId: req.vendorId,
        pincode: String(pincode),
        city: city ? String(city) : null,
        state: state ? String(state) : null,
        district: district ? String(district) : null,
        isPrimary: Boolean(isPrimary),
        coverageRank: coverageRank !== undefined ? Number(coverageRank) : 0,
      },
    });

    res.status(201).json({ success: true, serviceArea });
  } catch (error) {
    console.error("Add service area error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMyServiceArea = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendorId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const { pincode, city, state, district, isPrimary, coverageRank } = req.body;

    const existing = await prisma.vendorServiceArea.findFirst({
      where: { id, vendorId: req.vendorId },
    });

    if (!existing) {
      res.status(404).json({ error: "Service area not found" });
      return;
    }

    if (isPrimary) {
      await prisma.vendorServiceArea.updateMany({
        where: { vendorId: req.vendorId, isPrimary: true, id: { not: id } },
        data: { isPrimary: false },
      });
    }

    const serviceArea = await prisma.vendorServiceArea.update({
      where: { id },
      data: {
        ...(pincode !== undefined && { pincode: String(pincode) }),
        ...(city !== undefined && { city: city ? String(city) : null }),
        ...(state !== undefined && { state: state ? String(state) : null }),
        ...(district !== undefined && { district: district ? String(district) : null }),
        ...(isPrimary !== undefined && { isPrimary: Boolean(isPrimary) }),
        ...(coverageRank !== undefined && { coverageRank: Number(coverageRank) }),
      },
    });

    res.status(200).json({ success: true, serviceArea });
  } catch (error) {
    console.error("Update service area error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAdminNotesForVendor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findUnique({ where: { id } });
    if (!vendor) {
      res.status(404).json({ error: "Vendor not found" });
      return;
    }

    const notes = await prisma.adminInternalNote.findMany({ where: { entityType: "VENDOR", entityId: id }, orderBy: { createdAt: "desc" }, include: { createdByAdmin: { select: { id: true, name: true, email: true } } } });

    res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error("Get admin notes error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};