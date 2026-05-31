import { Router } from "express";
import { createQuoteRequest, listMyUserQuoteRequests, listMyVendorQuoteRequests, listQuoteRequests } from "../controllers/quote";
import { authMiddleware } from "../middleware/auth";
import { requireRoles } from "../middleware/role";
import { requireApprovedVendor } from "../middleware/vendor-approved";

const router = Router();

router.post("/request", createQuoteRequest);
router.get("/admin", authMiddleware, requireRoles(["SUPERADMIN", "ADMIN"]), listQuoteRequests);
router.get("/vendor/me", authMiddleware, requireRoles(["VENDOR"]), requireApprovedVendor, listMyVendorQuoteRequests);
router.get("/user/me", authMiddleware, requireRoles(["USER"]), listMyUserQuoteRequests);

export default router;
