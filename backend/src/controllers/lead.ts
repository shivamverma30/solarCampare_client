import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";
import { createAuditLog, createNotification, safeEmailDispatch } from "../lib/workflow";
import { notificationTemplates } from "../lib/notification-templates";

export const submitVendorLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { vendorId, userName, userEmail, userPhone, serviceRequirement, location, notes } = req.body;

    if (!vendorId || !userName || !userEmail || !serviceRequirement || !location) {
      res.status(400).json({ error: "Missing required lead fields" });
      return;
    }

    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });

    if (!vendor || vendor.status !== "APPROVED") {
      res.status(404).json({ error: "Vendor not available" });
      return;
    }

    const lead = await prisma.vendorLead.create({
      data: {
        userId: req.userId,
        vendorId,
        userName,
        userEmail,
        userPhone,
        serviceRequirement,
        location,
        notes,
      },
    });

    await prisma.leadStatusLog.create({
      data: {
        leadId: lead.id,
        previousStatus: "NEW",
        newStatus: "NEW",
        note: "Lead created by user enquiry",
      },
    });

    await createNotification(prisma, {
      audience: "ADMIN",
      type: "LEAD_CREATED",
      title: "New vendor enquiry",
      body: `${userName} has requested contact for ${vendor.companyName}.`,
      metadata: { leadId: lead.id, vendorId },
    });

    await safeEmailDispatch(
      "New vendor enquiry",
      `${userName} (${userEmail}) requested contact for ${vendor.companyName}.`
    );

    await createAuditLog(prisma, {
      actorType: req.subjectType || "user",
      actorId: req.userId || req.vendorId,
      action: "lead.created",
      entityType: "LEAD",
      entityId: lead.id,
      metadata: { leadId: lead.id, vendorId },
    });

    res.status(201).json({ success: true, lead });
  } catch (error) {
    console.error("Submit lead error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const submitContactInquiry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ error: "Missing required inquiry fields" });
      return;
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        userId: req.userId,
      },
    });

    await createNotification(prisma, {
      audience: "ADMIN",
      type: "INQUIRY",
      title: "New contact inquiry",
      body: `${name} submitted a contact inquiry from the website.`,
      metadata: { inquiryId: inquiry.id, email },
    });

    await safeEmailDispatch("New contact inquiry", `${name} (${email}) submitted a website inquiry.`);

    res.status(201).json({ success: true, inquiry });
  } catch (error) {
    console.error("Submit inquiry error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const listLeads = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const leads = await prisma.vendorLead.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        vendor: {
          select: {
            id: true,
            companyName: true,
            serviceArea: true,
            status: true,
          },
        },
        statusLogs: true,
        commissionNotes: true,
      },
    });

    res.status(200).json({ success: true, leads });
  } catch (error) {
    console.error("List leads error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.adminId && !req.vendorId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const lead = await prisma.vendorLead.findUnique({
      where: { id },
      select: {
        id: true,
        vendorId: true,
      },
    });

    if (!lead) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }

    if (req.authRole === "VENDOR" && req.vendorId !== lead.vendorId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    await createAuditLog(prisma, {
      actorType: req.subjectType || "admin",
      actorId: req.adminId || req.vendorId,
      action: "lead.deleted",
      entityType: "LEAD",
      entityId: lead.id,
      metadata: { leadId: lead.id, vendorId: lead.vendorId },
      createdByAdminId: req.adminId,
    });

    await prisma.vendorLead.delete({
      where: { id },
    });

    res.status(200).json({ success: true, message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Delete lead error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateLeadStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.adminId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const { status, note } = req.body;

    const lead = await prisma.vendorLead.findUnique({ where: { id } });

    if (!lead) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }

    const updated = await prisma.vendorLead.update({
      where: { id },
      data: {
        status,
        assignedAdminId: req.adminId,
      },
    });

    await prisma.leadStatusLog.create({
      data: {
        leadId: lead.id,
        previousStatus: lead.status,
        newStatus: status,
        note,
        actorAdminId: req.adminId,
      },
    });

    await createNotification(prisma, {
      audience: "ADMIN",
      type: "LEAD_UPDATED",
      title: "Lead status updated",
      body: `Lead ${lead.id} moved to ${status}.`,
      metadata: { leadId: lead.id, status },
    });

    res.status(200).json({ success: true, lead: updated });
  } catch (error) {
    console.error("Update lead status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const assignLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.adminId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const { assignedAdminId, note } = req.body;

    const lead = await prisma.vendorLead.findUnique({ where: { id } });

    if (!lead) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }

    const updated = await prisma.vendorLead.update({
      where: { id },
      data: {
        assignedAdminId: assignedAdminId || req.adminId,
        status: "VENDOR_ASSIGNED",
      },
    });

    await prisma.leadStatusLog.create({
      data: {
        leadId: lead.id,
        previousStatus: lead.status,
        newStatus: "VENDOR_ASSIGNED",
        note: note || "Lead assigned",
        actorAdminId: req.adminId,
      },
    });

    res.status(200).json({ success: true, lead: updated });
  } catch (error) {
    console.error("Assign lead error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addCommissionNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.adminId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const { note, amount } = req.body;

    const lead = await prisma.vendorLead.findUnique({ where: { id } });

    if (!lead) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }

    const commissionNote = await prisma.commissionNote.create({
      data: {
        leadId: lead.id,
        vendorId: lead.vendorId,
        note,
        amount: amount ? Number(amount) : undefined,
        createdByAdminId: req.adminId,
      },
    });

    res.status(201).json({ success: true, commissionNote });
  } catch (error) {
    console.error("Add commission note error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const listVendorLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendorId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const leads = await prisma.vendorLead.findMany({
      where: { vendorId: req.vendorId },
      orderBy: { createdAt: "desc" },
      include: {
        statusLogs: true,
      },
    });

    res.status(200).json({ success: true, leads });
  } catch (error) {
    console.error("List vendor leads error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const requestConsultation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { vendorId } = req.body as { vendorId?: string };
    if (!vendorId) {
      res.status(400).json({ error: "vendorId is required" });
      return;
    }

    const [user, vendor] = await Promise.all([
      prisma.user.findUnique({
        where: { id: req.userId },
        select: { id: true, fullName: true, email: true, phone: true, city: true, state: true, pincode: true },
      }),
      prisma.vendor.findUnique({
        where: { id: vendorId },
        select: { id: true, companyName: true, ownerName: true, email: true, phone: true, status: true },
      }),
    ]);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!vendor || vendor.status !== "APPROVED") {
      res.status(404).json({ error: "Vendor not available" });
      return;
    }

    const lead = await prisma.vendorLead.create({
      data: {
        userId: user.id,
        vendorId: vendor.id,
        userName: user.fullName,
        userEmail: user.email,
        userPhone: user.phone,
        serviceRequirement: "Consultation Request",
        location: [user.city, user.state, user.pincode].filter(Boolean).join(", ") || "Not provided",
        notes: "Requested via vendor consultation flow",
      },
    });

    const notification = notificationTemplates.consultationRequest({
      userName: user.fullName,
      userEmail: user.email,
      userPhone: user.phone,
      vendorName: vendor.ownerName,
      businessName: vendor.companyName,
      vendorEmail: vendor.email,
      vendorPhone: vendor.phone,
      timestamp: new Date(),
      status: "NEW",
    });

    await createNotification(prisma, {
      audience: "ADMIN",
      type: notification.admin.type,
      priority: notification.admin.priority,
      title: notification.admin.title,
      body: notification.admin.body,
      vendorId: vendor.id,
      userId: user.id,
      metadata: {
        ...(notification.admin.metadata as Record<string, unknown>),
        leadId: lead.id,
      },
    });

    await createNotification(prisma, {
      audience: "VENDOR",
      type: notification.vendor.type,
      priority: notification.vendor.priority,
      title: notification.vendor.title,
      body: notification.vendor.body,
      vendorId: vendor.id,
      metadata: {
        ...(notification.vendor.metadata as Record<string, unknown>),
        leadId: lead.id,
      },
    });

    await safeEmailDispatch(
      "New consultation request",
      `${user.fullName} requested a consultation with ${vendor.companyName}.`
    );

    res.status(201).json({ success: true, lead });
  } catch (error) {
    console.error("Request consultation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};