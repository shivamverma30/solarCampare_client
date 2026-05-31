import { NextFunction, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "./auth";

export const requireApprovedVendor = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.vendorId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const vendor = await prisma.vendor.findUnique({
      where: { id: req.vendorId },
      select: { status: true, rejectionReason: true },
    });

    if (!vendor) {
      res.status(404).json({ error: "Vendor not found" });
      return;
    }

    if (vendor.status === "PENDING") {
      res.status(403).json({ error: "Your account is under admin review.", status: vendor.status });
      return;
    }

    if (vendor.status === "REJECTED") {
      res.status(403).json({ error: vendor.rejectionReason || "Your account is rejected.", status: vendor.status });
      return;
    }

    next();
  } catch (error) {
    console.error("Vendor approval middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
