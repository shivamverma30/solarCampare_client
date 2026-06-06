import { Router } from "express";
import {
  addCommissionNote,
  deleteLead,
  assignLead,
  listLeads,
  listUserConsultationLeads,
  listVendorLeads,
  requestConsultation,
  submitContactInquiry,
  submitVendorLead,
  updateConsultationTrackerStatus,
  updateLeadStatus,
} from "../controllers/lead";
import { authMiddleware } from "../middleware/auth";
import { requireRoles } from "../middleware/role";
import { requireApprovedVendor } from "../middleware/vendor-approved";

const router = Router();

router.post("/inquiry", submitContactInquiry);
router.post("/vendor", submitVendorLead);
router.post("/consultation", authMiddleware, requireRoles(["USER"]), requestConsultation);
router.get("/user/consultations", authMiddleware, requireRoles(["USER"]), listUserConsultationLeads);
router.get("/vendor/me", authMiddleware, requireRoles(["VENDOR"]), requireApprovedVendor, listVendorLeads);
router.get("/admin", authMiddleware, requireRoles(["SUPERADMIN", "ADMIN"]), listLeads);
router.delete("/:id", authMiddleware, requireRoles(["SUPERADMIN", "ADMIN", "VENDOR"]), deleteLead);
router.patch("/:id/status", authMiddleware, requireRoles(["SUPERADMIN", "ADMIN"]), updateLeadStatus);
router.patch("/:id/tracker", authMiddleware, requireRoles(["SUPERADMIN", "ADMIN", "VENDOR"]), updateConsultationTrackerStatus);
router.patch("/:id/assign", authMiddleware, requireRoles(["SUPERADMIN", "ADMIN"]), assignLead);
router.post("/:id/commission", authMiddleware, requireRoles(["SUPERADMIN", "ADMIN"]), addCommissionNote);

export default router;