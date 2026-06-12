import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { requireRoles } from "../middleware/role";
import { getMyReferralRewards, listAdminReferrals, resolveReferralCode, shareReferralLink } from "../controllers/referral";

const router = Router();

router.get("/me", authMiddleware, requireRoles(["USER"]), getMyReferralRewards);
router.post("/share", authMiddleware, requireRoles(["USER"]), shareReferralLink);
router.get("/resolve", resolveReferralCode);
router.get("/admin", authMiddleware, requireRoles(["SUPERADMIN", "ADMIN"]), listAdminReferrals);

export default router;