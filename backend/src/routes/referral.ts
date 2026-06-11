import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { requireRoles } from "../middleware/role";
import { getMyReferralRewards, shareReferralLink } from "../controllers/referral";

const router = Router();

router.get("/me", authMiddleware, requireRoles(["USER"]), getMyReferralRewards);
router.post("/share", authMiddleware, requireRoles(["USER"]), shareReferralLink);

export default router;