import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

function getAudienceFromRequest(req: AuthRequest) {
  if (req.adminId) {
    return { audience: "ADMIN" as const, adminId: req.adminId };
  }

  if (req.userId) {
    return { audience: "USER" as const, userId: req.userId };
  }

  if (req.vendorId) {
    return { audience: "VENDOR" as const, vendorId: req.vendorId };
  }

  return null;
}

async function createReadState(notificationId: string, recipient: ReturnType<typeof getAudienceFromRequest>) {
  if (!recipient) {
    return;
  }

  const existing = await prisma.notificationReadState.findFirst({
    where: {
      notificationId,
      ...(recipient.adminId ? { adminId: recipient.adminId } : {}),
      ...(recipient.userId ? { userId: recipient.userId } : {}),
      ...(recipient.vendorId ? { vendorId: recipient.vendorId } : {}),
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.notificationReadState.create({
    data: {
      notificationId,
      ...(recipient.adminId ? { adminId: recipient.adminId } : {}),
      ...(recipient.userId ? { userId: recipient.userId } : {}),
      ...(recipient.vendorId ? { vendorId: recipient.vendorId } : {}),
    },
  });
}

export const listNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recipient = getAudienceFromRequest(req);

    if (!recipient) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const notifications = await prisma.notification.findMany({
      where: {
        audience: recipient.audience,
        ...(recipient.adminId ? { OR: [{ adminId: recipient.adminId }, { adminId: null }] } : {}),
        ...(recipient.userId ? { OR: [{ userId: recipient.userId }, { userId: null }] } : {}),
        ...(recipient.vendorId ? { OR: [{ vendorId: recipient.vendorId }, { vendorId: null }] } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        readStates: {
          where: {
            ...(recipient.adminId ? { adminId: recipient.adminId } : {}),
            ...(recipient.userId ? { userId: recipient.userId } : {}),
            ...(recipient.vendorId ? { vendorId: recipient.vendorId } : {}),
          },
        },
      },
    });

    const payload = notifications.map((notification) => ({
      ...notification,
      isRead: Boolean(notification.readAt || notification.readStates.length > 0),
    }));

    res.status(200).json({ success: true, notifications: payload });
  } catch (error) {
    console.error("List notifications error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markNotificationRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recipient = getAudienceFromRequest(req);

    if (!recipient) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const notification = await prisma.notification.findUnique({ where: { id } });

    if (!notification) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    await createReadState(notification.id, recipient);

    res.status(200).json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.error("Mark notification read error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markAllNotificationsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recipient = getAudienceFromRequest(req);

    if (!recipient) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const notifications = await prisma.notification.findMany({
      where: {
        audience: recipient.audience,
        ...(recipient.adminId ? { OR: [{ adminId: recipient.adminId }, { adminId: null }] } : {}),
        ...(recipient.userId ? { OR: [{ userId: recipient.userId }, { userId: null }] } : {}),
        ...(recipient.vendorId ? { OR: [{ vendorId: recipient.vendorId }, { vendorId: null }] } : {}),
      },
      select: { id: true },
    });

    for (const notification of notifications) {
      await createReadState(notification.id, recipient);
    }

    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getNotificationUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recipient = getAudienceFromRequest(req);

    if (!recipient) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const notifications = await prisma.notification.findMany({
      where: {
        audience: recipient.audience,
        ...(recipient.adminId ? { OR: [{ adminId: recipient.adminId }, { adminId: null }] } : {}),
        ...(recipient.userId ? { OR: [{ userId: recipient.userId }, { userId: null }] } : {}),
        ...(recipient.vendorId ? { OR: [{ vendorId: recipient.vendorId }, { vendorId: null }] } : {}),
      },
      include: {
        readStates: {
          where: {
            ...(recipient.adminId ? { adminId: recipient.adminId } : {}),
            ...(recipient.userId ? { userId: recipient.userId } : {}),
            ...(recipient.vendorId ? { vendorId: recipient.vendorId } : {}),
          },
          select: { id: true },
        },
      },
    });

    const unreadCount = notifications.filter((notification) => notification.readStates.length === 0).length;

    res.status(200).json({ success: true, unreadCount });
  } catch (error) {
    console.error("Get notification unread count error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recipient = getAudienceFromRequest(req);

    if (!recipient) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const notification = await prisma.notification.findUnique({ where: { id } });

    if (!notification) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    // Only allow deletion for ADMIN audience by SUPERADMIN role
    if (notification.audience === "ADMIN") {
      if (req.authRole !== "SUPERADMIN") {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
    }

    // Vendors may delete notifications addressed to their vendorId or broadcast vendor notifications (vendorId null)
    if (notification.audience === "VENDOR") {
      if (!req.vendorId) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      if (notification.vendorId && notification.vendorId !== req.vendorId) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
    }

    // Users are not allowed to delete notifications via this endpoint
    if (notification.audience === "USER") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    await prisma.notification.delete({ where: { id } });

    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
