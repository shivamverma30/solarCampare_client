import { Router } from "express";
import {
  addCommissionNote,
  assignLead,
  listLeads,
  listVendorLeads,
  submitContactInquiry,
  submitVendorLead,
  updateLeadStatus,
} from "../controllers/lead";
import { authMiddleware } from "../middleware/auth";
import { requireRoles } from "../middleware/role";
import { requireApprovedVendor } from "../middleware/vendor-approved";

const router = Router();

router.post("/inquiry", submitContactInquiry);
router.post("/vendor", submitVendorLead);
router.get("/vendor/me", authMiddleware, requireRoles(["VENDOR"]), requireApprovedVendor, listVendorLeads);
router.get("/admin", authMiddleware, requireRoles(["SUPERADMIN", "ADMIN"]), listLeads);
router.patch("/:id/status", authMiddleware, requireRoles(["SUPERADMIN", "ADMIN"]), updateLeadStatus);
router.patch("/:id/assign", authMiddleware, requireRoles(["SUPERADMIN", "ADMIN"]), assignLead);
router.post("/:id/commission", authMiddleware, requireRoles(["SUPERADMIN", "ADMIN"]), addCommissionNote);

export default router;