import { Router } from "express";
import { getNotificationUnreadCount, listNotifications, markAllNotificationsRead, markNotificationRead } from "../controllers/notification";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", listNotifications);
router.get("/unread-count", getNotificationUnreadCount);
router.patch("/read-all", markAllNotificationsRead);
router.patch("/:id/read", markNotificationRead);

export default router;
