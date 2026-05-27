import { Router } from "express";
import { getSuperAdminStats } from "../controllers/dashboard";
import { authMiddleware } from "../middleware/auth";
import { requireRoles } from "../middleware/role";

const router = Router();

router.get("/superadmin/stats", authMiddleware, requireRoles(["SUPERADMIN"]), getSuperAdminStats);

export default router;