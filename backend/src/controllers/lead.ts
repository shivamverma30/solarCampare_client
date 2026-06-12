import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";
import { createAuditLog, createNotification, safeEmailDispatch } from "../lib/workflow";
import { notificationTemplates } from "../lib/notification-templates";
import { ConsultationTrackingStatus } from "@prisma/client";

const consultationTrackerFlow: ConsultationTrackingStatus[] = [
  "CONSULTATION_REQUESTED",
  "REQUEST_REVIEWED",
  "VENDOR_ASSIGNED",
  "APPOINTMENT_SCHEDULED",
  "SITE_VISIT_COMPLETED",
  "PROPOSAL_SHARED",
  "NEGOTIATION",
  "PROJECT_CONFIRMED",
  "INSTALLATION_IN_PROGRESS",
  "INSTALLATION_COMPLETED",
];

const vendorAllowedTrackerStatuses: ConsultationTrackingStatus[] = [
  "APPOINTMENT_SCHEDULED",
  "SITE_VISIT_COMPLETED",
  "PROPOSAL_SHARED",
  "NEGOTIATION",
];

const consultationTrackerNotificationBody: Record<ConsultationTrackingStatus, string> = {
  CONSULTATION_REQUESTED: "Your consultation request has been submitted successfully.",
  REQUEST_REVIEWED: "Your consultation request has been reviewed.",
  VENDOR_ASSIGNED: "A vendor has been assigned to your consultation request.",
  APPOINTMENT_SCHEDULED: "Your consultation appointment has been scheduled.",
  SITE_VISIT_COMPLETED: "Site visit completed for your consultation request.",
  PROPOSAL_SHARED: "Your solar proposal has been shared.",
  NEGOTIATION: "Your consultation has moved to negotiation/discussion.",
  PROJECT_CONFIRMED: "Your solar project has been confirmed.",
  INSTALLATION_IN_PROGRESS: "Installation is now in progress.",
  INSTALLATION_COMPLETED: "Installation has been completed successfully.",
};

const consultationTrackerDisplayLabel: Record<ConsultationTrackingStatus, string> = {
  CONSULTATION_REQUESTED: "Request Submitted",
  REQUEST_REVIEWED: "Contacted",
  VENDOR_ASSIGNED: "Vendor Assigned",
  APPOINTMENT_SCHEDULED: "Site Visit Scheduled",
  SITE_VISIT_COMPLETED: "Site Visit Completed",
  PROPOSAL_SHARED: "Quotation Shared",
  NEGOTIATION: "Negotiation",
  PROJECT_CONFIRMED: "Project Confirmed",
  INSTALLATION_IN_PROGRESS: "Installation In Progress",
  INSTALLATION_COMPLETED: "Installation Completed",
};

function trackerStatusIndex(status: ConsultationTrackingStatus): number {
  return consultationTrackerFlow.indexOf(status);
}

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
        consultationTracking: {
          orderBy: { createdAt: "asc" },
        },
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
        consultationTracking: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    res.status(200).json({ success: true, leads });
  } catch (error) {
    console.error("List vendor leads error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const listUserConsultationLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const consultations = await prisma.vendorLead.findMany({
      where: {
        userId: req.userId,
        serviceRequirement: "Consultation Request",
      },
      orderBy: { createdAt: "desc" },
      include: {
        vendor: {
          select: {
            id: true,
            companyName: true,
            ownerName: true,
            city: true,
            state: true,
            pincode: true,
          },
        },
        consultationTracking: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    res.status(200).json({ success: true, consultations });
  } catch (error) {
    console.error("List user consultation leads error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateConsultationTrackerStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const actorId = req.adminId || req.vendorId;
    if (!actorId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const status = String(req.body?.status || "") as ConsultationTrackingStatus;
    const notes = req.body?.notes ? String(req.body.notes) : null;

    if (!consultationTrackerFlow.includes(status)) {
      res.status(400).json({ error: "Invalid tracker status" });
      return;
    }

    const consultation = await prisma.vendorLead.findUnique({
      where: { id },
      include: {
        consultationTracking: {
          orderBy: { createdAt: "asc" },
        },
        user: {
          select: { id: true, fullName: true },
        },
        vendor: {
          select: { id: true, companyName: true },
        },
      },
    });

    if (!consultation) {
      res.status(404).json({ error: "Consultation request not found" });
      return;
    }

    const isVendorActor = req.authRole === "VENDOR";

    if (isVendorActor) {
      if (!req.vendorId || req.vendorId !== consultation.vendorId) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      if (!vendorAllowedTrackerStatuses.includes(status)) {
        res.status(403).json({ error: "Vendors can only update appointment, visit, proposal, or negotiation stages" });
        return;
      }

      const hasVendorAssignment = consultation.consultationTracking.some((entry) => entry.status === "VENDOR_ASSIGNED");
      if (!hasVendorAssignment) {
        res.status(403).json({ error: "Tracker cannot be updated by vendor before assignment" });
        return;
      }
    }

    const latestEntry = consultation.consultationTracking[consultation.consultationTracking.length - 1];
    const currentStatus = latestEntry?.status || "CONSULTATION_REQUESTED";

    if (!consultation.userId) {
      res.status(400).json({ error: "Consultation request has no associated user" });
      return;
    }

    if (trackerStatusIndex(status) <= trackerStatusIndex(currentStatus)) {
      res.status(400).json({ error: "Tracker status can only move forward" });
      return;
    }

    const tracking = await prisma.consultationTracking.create({
      data: {
        userId: consultation.userId,
        vendorId: consultation.vendorId,
        consultationId: consultation.id,
        status,
        notes,
        updatedBy: isVendorActor ? `vendor:${req.vendorId}` : `admin:${req.adminId}`,
      },
    });

    if (status === "INSTALLATION_COMPLETED") {
      const referral = await prisma.referral.findUnique({
        where: { referredUserId: consultation.userId },
        include: {
          referrer: {
            select: { id: true, fullName: true, email: true },
          },
          referredUser: {
            select: { id: true, fullName: true, email: true },
          },
        },
      });

      if (referral && referral.installationStatus !== "COMPLETED") {
        await prisma.referral.update({
          where: { referredUserId: consultation.userId },
          data: { installationStatus: "COMPLETED" },
        });

        const completedAt = tracking.createdAt.toISOString();

        await createNotification(prisma, {
          audience: "ADMIN",
          type: "SYSTEM",
          priority: "MEDIUM",
          title: `Referral reward milestone completed for ${referral.referrer.fullName}`,
          body: [
            `Referrer Name: ${referral.referrer.fullName}`,
            `Referred User Name: ${referral.referredUser.fullName}`,
            `Date/Time: ${completedAt}`,
          ].join("\n"),
          metadata: {
            category: "referral",
            referrerId: referral.referrer.id,
            referrerName: referral.referrer.fullName,
            referredUserId: referral.referredUser.id,
            referredUserName: referral.referredUser.fullName,
            installationStatus: "COMPLETED",
            completedAt,
          },
        });

        await createNotification(prisma, {
          audience: "USER",
          userId: referral.referrer.id,
          type: "SYSTEM",
          priority: "MEDIUM",
          title: `Referral reward milestone completed for ${referral.referrer.fullName}`,
          body: `${referral.referredUser.fullName} reached Installation Completed.`,
          metadata: {
            category: "referral",
            referrerId: referral.referrer.id,
            referrerName: referral.referrer.fullName,
            referredUserId: referral.referredUser.id,
            referredUserName: referral.referredUser.fullName,
            installationStatus: "COMPLETED",
            completedAt,
          },
        });
      }
    }

    if (consultation.userId) {
      await createNotification(prisma, {
        audience: "USER",
        type: "LEAD_UPDATED",
        priority: "MEDIUM",
        title: "Application Tracker Update",
        body: [
          `Status: ${consultationTrackerDisplayLabel[status]}`,
          consultationTrackerNotificationBody[status],
          `Vendor: ${consultation.vendor?.companyName || "-"}`,
          `Notes: ${notes || "-"}`,
        ].join("\n"),
        userId: consultation.userId,
        vendorId: consultation.vendorId,
        metadata: {
          consultationId: consultation.id,
          vendorId: consultation.vendorId,
          status,
          statusLabel: consultationTrackerDisplayLabel[status],
          notes,
          updatedBy: tracking.updatedBy,
          updatedAt: tracking.createdAt,
        },
      });
    }

    if (consultation.vendorId) {
      await createNotification(prisma, {
        audience: "VENDOR",
        type: "LEAD_UPDATED",
        priority: "MEDIUM",
        title: "Application Tracker Update",
        body: [
          `Status: ${consultationTrackerDisplayLabel[status]}`,
          consultationTrackerNotificationBody[status],
          `Customer: ${consultation.user?.fullName || consultation.userId || "-"}`,
          `Notes: ${notes || "-"}`,
        ].join("\n"),
        vendorId: consultation.vendorId,
        metadata: {
          consultationId: consultation.id,
          vendorId: consultation.vendorId,
          status,
          statusLabel: consultationTrackerDisplayLabel[status],
          notes,
          updatedBy: tracking.updatedBy,
          updatedAt: tracking.createdAt,
        },
      });
    }

    res.status(200).json({ success: true, tracking });
  } catch (error) {
    console.error("Update consultation tracker status error:", error);
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

    await prisma.consultationTracking.create({
      data: {
        userId: user.id,
        vendorId: vendor.id,
        consultationId: lead.id,
        status: "CONSULTATION_REQUESTED",
        notes: "Consultation request created by user.",
        updatedBy: `user:${user.id}`,
      },
    });

    const notification = notificationTemplates.consultationRequest({
      userName: user.fullName,
      userEmail: user.email,
      userPhone: user.phone,
      userCity: user.city,
      userState: user.state,
      userPincode: user.pincode,
      serviceRequirement: "Consultation Request",
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
      audience: "USER",
      type: notification.user.type,
      priority: notification.user.priority,
      title: notification.user.title,
      body: notification.user.body,
      userId: user.id,
      vendorId: vendor.id,
      metadata: {
        ...(notification.user.metadata as Record<string, unknown>),
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