import { Router } from "express";
import { getSuperAdminStats, getUserStats, getVendorStats } from "../controllers/dashboard";
import { authMiddleware } from "../middleware/auth";
import { requireRoles } from "../middleware/role";
import { requireApprovedVendor } from "../middleware/vendor-approved";

const router = Router();

router.get("/superadmin/stats", authMiddleware, requireRoles(["SUPERADMIN"]), getSuperAdminStats);
router.get("/vendor/stats", authMiddleware, requireRoles(["VENDOR"]), requireApprovedVendor, getVendorStats);
router.get("/user/stats", authMiddleware, requireRoles(["USER"]), getUserStats);

export default router;