import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";
import { createNotification, safeEmailDispatch } from "../lib/workflow";

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

    await createNotification(prisma, {
      audience: "ADMIN",
      type: "QUOTE_REQUEST",
      title: "New quote request",
      body: `${fullName} submitted a quote request${pincode ? ` for PIN ${pincode}` : ""}.`,
      metadata: {
        quoteRequestId: quoteRequest.id,
        pincode: quoteRequest.pincode,
        city: quoteRequest.city,
        state: quoteRequest.state,
      },
    });

    await safeEmailDispatch(
      "New quote request",
      `${fullName} (${email}) submitted a quote request${pincode ? ` for PIN ${pincode}` : ""}.`
    );

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
