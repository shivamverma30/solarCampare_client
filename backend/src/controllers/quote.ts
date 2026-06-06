import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";
import { createNotification, safeEmailDispatch } from "../lib/workflow";
import { notificationTemplates } from "../lib/notification-templates";

export const createQuoteRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      email,
      phone,
      pincode,
      city,
      state,
      projectType,
      monthlyBill,
      roofSize,
      notes,
      vendorId,
      metadata,
    } = req.body as Record<string, unknown>;

    if (!fullName || !email) {
      res.status(400).json({ error: "fullName and email are required" });
      return;
    }

    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        userId: req.userId || null,
        vendorId: vendorId ? String(vendorId) : null,
        fullName: String(fullName),
        email: String(email),
        phone: phone ? String(phone) : null,
        pincode: pincode ? String(pincode) : null,
        city: city ? String(city) : null,
        state: state ? String(state) : null,
        projectType: projectType ? String(projectType) : null,
        monthlyBill: monthlyBill ? Number(monthlyBill) : null,
        roofSize: roofSize ? Number(roofSize) : null,
        notes: notes ? String(notes) : null,
        metadata: metadata as never,
      },
    });

    const metadataRecord = metadata && typeof metadata === "object" && metadata !== null ? (metadata as Record<string, unknown>) : {};
    const serviceName = typeof metadataRecord.serviceName === "string" ? metadataRecord.serviceName : undefined;
    const inquiryType = typeof metadataRecord.inquiryType === "string" ? metadataRecord.inquiryType : undefined;

    const notification = notificationTemplates.quoteRequest({
      name: String(fullName),
      email: String(email),
      phone: phone ? String(phone) : null,
      pincode: pincode ? String(pincode) : null,
      city: city ? String(city) : null,
      state: state ? String(state) : null,
      serviceName,
      inquiryType,
      message: notes ? String(notes) : null,
      monthlyBill: monthlyBill ? Number(monthlyBill) : null,
      roofSize: roofSize ? Number(roofSize) : null,
      recommendedCapacity: metadata && typeof metadata === "object" && metadata !== null && "recommendedKw" in metadata ? `${Number((metadata as Record<string, unknown>).recommendedKw || 0).toFixed(1)} kW` : undefined,
      estimatedSavings: metadata && typeof metadata === "object" && metadata !== null && "annualSavings" in metadata ? `₹${Math.round(Number((metadata as Record<string, unknown>).annualSavings || 0)).toLocaleString("en-IN")}/yr` : undefined,
      roi: metadata && typeof metadata === "object" && metadata !== null && "roiYears" in metadata ? `${Number((metadata as Record<string, unknown>).roiYears || 0).toFixed(1)} years` : undefined,
      timestamp: new Date(),
    });

    await createNotification(prisma, {
      audience: "ADMIN",
      type: notification.type,
      priority: notification.priority,
      title: notification.title,
      body: notification.body,
      metadata: {
        quoteRequestId: quoteRequest.id,
        pincode: quoteRequest.pincode,
        city: quoteRequest.city,
        state: quoteRequest.state,
        monthlyBill: quoteRequest.monthlyBill,
        roofSize: quoteRequest.roofSize,
        metadata: quoteRequest.metadata,
      },
    });

    await safeEmailDispatch(notification.title, notification.body);

    res.status(201).json({ success: true, quoteRequest });
  } catch (error) {
    console.error("Create quote request error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const listQuoteRequests = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const quoteRequests = await prisma.quoteRequest.findMany({
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
        uploads: true,
      },
    });

    res.status(200).json({ success: true, quoteRequests });
  } catch (error) {
    console.error("List quote requests error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const listMyVendorQuoteRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendorId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const quoteRequests = await prisma.quoteRequest.findMany({
      where: { vendorId: req.vendorId },
      orderBy: { createdAt: "desc" },
      include: { uploads: true },
    });

    res.status(200).json({ success: true, quoteRequests });
  } catch (error) {
    console.error("List vendor quote requests error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const listMyUserQuoteRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const quoteRequests = await prisma.quoteRequest.findMany({
      where: { userId: req.userId },
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
        uploads: true,
      },
    });

    res.status(200).json({ success: true, quoteRequests });
  } catch (error) {
    console.error("List user quote requests error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
