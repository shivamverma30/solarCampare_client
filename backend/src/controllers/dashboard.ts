import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

export const getSuperAdminStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalUsers,
      totalVendors,
      pendingVendors,
      approvedVendors,
      rejectedVendors,
      totalLeads,
      newLeads,
      contactedLeads,
      assignedLeads,
      recentUsers,
      recentVendors,
      recentLeads,
      recentInquiries,
      calculatorUsage,
      quoteRequests,
      vendorServiceAreas,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.vendor.count(),
      prisma.vendor.count({ where: { status: "PENDING" } }),
      prisma.vendor.count({ where: { status: "APPROVED" } }),
      prisma.vendor.count({ where: { status: "REJECTED" } }),
      prisma.vendorLead.count(),
      prisma.vendorLead.count({ where: { status: "NEW" } }),
      prisma.vendorLead.count({ where: { status: "CONTACTED" } }),
      prisma.vendorLead.count({ where: { status: "VENDOR_ASSIGNED" } }),
      prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, fullName: true, email: true, createdAt: true } }),
      prisma.vendor.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, companyName: true, email: true, status: true, createdAt: true } }),
      prisma.vendorLead.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, userName: true, userEmail: true, status: true, vendorId: true, createdAt: true } }),
      prisma.contactInquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.calculatorHistory.count(),
      prisma.quoteRequest.count(),
      prisma.vendorServiceArea.count(),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalVendors,
        pendingVendors,
        approvedVendors,
        rejectedVendors,
        totalLeads,
        newLeads,
        contactedLeads,
        assignedLeads,
        recentUsers,
        recentVendors,
        recentLeads,
        recentInquiries,
        calculatorUsage,
        quoteRequests,
        vendorServiceAreas,
        revenueAnalytics: {
          currentMonth: 0,
          projected: 0,
          placeholder: true,
        },
        leadConversion: {
          closedWon: await prisma.vendorLead.count({ where: { status: "CLOSED_WON" } }),
          closedLost: await prisma.vendorLead.count({ where: { status: "CLOSED_LOST" } }),
        },
      },
    });
  } catch (error) {
    console.error("Get super admin stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};