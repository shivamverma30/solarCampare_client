import { Router } from "express";
import {
	addMyServiceArea,
	approveVendor,
	getMyVendorProfile,
	getVendorById,
	listAdminVendors,
	listMyServiceAreas,
	listPublicVendors,
	matchVendorsByPincode,
	rejectVendor,
	addAdminNoteToVendor,
	updateMyServiceArea,
	updateMyVendorProfile,
    getAdminNotesForVendor,
} from "../controllers/vendor";
import { authMiddleware } from "../middleware/auth";
import { requireRoles } from "../middleware/role";
import { requireApprovedVendor } from "../middleware/vendor-approved";

const router = Router();

router.get("/", listPublicVendors);
router.get("/match", matchVendorsByPincode);
router.get("/me/profile", authMiddleware, requireRoles(["VENDOR"]), getMyVendorProfile);
router.put("/me/profile", authMiddleware, requireRoles(["VENDOR"]), requireApprovedVendor, updateMyVendorProfile);
router.get("/me/service-areas", authMiddleware, requireRoles(["VENDOR"]), requireApprovedVendor, listMyServiceAreas);
router.post("/me/service-areas", authMiddleware, requireRoles(["VENDOR"]), requireApprovedVendor, addMyServiceArea);
router.put("/me/service-areas/:id", authMiddleware, requireRoles(["VENDOR"]), requireApprovedVendor, updateMyServiceArea);
router.get("/admin/all", authMiddleware, requireRoles(["SUPERADMIN"]), listAdminVendors);
router.get("/:id", getVendorById);
router.get("/:id/notes", authMiddleware, requireRoles(["SUPERADMIN"]), getAdminNotesForVendor);
router.post("/:id/approve", authMiddleware, requireRoles(["SUPERADMIN"]), approveVendor);
router.post("/:id/reject", authMiddleware, requireRoles(["SUPERADMIN"]), rejectVendor);
router.post("/:id/notes", authMiddleware, requireRoles(["SUPERADMIN"]), addAdminNoteToVendor);

export default router;