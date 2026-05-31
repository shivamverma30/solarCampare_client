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

export const getVendorStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.vendorId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const [vendor, leadCount, quoteRequests, productsCount, unreadNotifications] = await Promise.all([
      prisma.vendor.findUnique({
        where: { id: req.vendorId },
        select: {
          id: true,
          companyName: true,
          ownerName: true,
          status: true,
          pincode: true,
          city: true,
          state: true,
          serviceAreas: true,
        },
      }),
      prisma.vendorLead.count({ where: { vendorId: req.vendorId } }),
      prisma.quoteRequest.count({ where: { vendorId: req.vendorId } }),
      prisma.product.count({ where: { vendorId: req.vendorId } }),
      prisma.notification.count({ where: { audience: "VENDOR", OR: [{ vendorId: req.vendorId }, { vendorId: null }] } }),
    ]);

    if (!vendor) {
      res.status(404).json({ error: "Vendor not found" });
      return;
    }

    res.status(200).json({
      success: true,
      stats: {
        vendor,
        leadCount,
        quoteRequests,
        productsCount,
        unreadNotifications,
      },
    });
  } catch (error) {
    console.error("Get vendor stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        pincode: true,
        city: true,
        state: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const [historyCount, quoteCount, notificationCount, nearbyVendors] = await Promise.all([
      prisma.calculatorHistory.count({ where: { userId: req.userId } }),
      prisma.quoteRequest.count({ where: { userId: req.userId } }),
      prisma.notification.count({ where: { audience: "USER", OR: [{ userId: req.userId }, { userId: null }] } }),
      user.pincode
        ? prisma.vendor.findMany({
            where: {
              status: "APPROVED",
              OR: [
                { pincode: user.pincode },
                { serviceAreas: { some: { pincode: user.pincode } } },
                ...(user.city ? [{ city: user.city }, { serviceAreas: { some: { city: user.city } } }] : []),
                ...(user.state ? [{ state: user.state }, { serviceAreas: { some: { state: user.state } } }] : []),
              ],
            },
            take: 12,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              companyName: true,
              ownerName: true,
              serviceArea: true,
              city: true,
              state: true,
              pincode: true,
              logoUrl: true,
              experience: true,
              businessType: true,
            },
          })
        : Promise.resolve([]),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        user,
        historyCount,
        quoteCount,
        notificationCount,
        nearbyVendors,
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};