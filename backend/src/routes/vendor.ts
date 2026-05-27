import { Router } from "express";
import { approveVendor, getVendorById, listAdminVendors, listPublicVendors, matchVendorsByPincode, rejectVendor } from "../controllers/vendor";
import { authMiddleware } from "../middleware/auth";
import { requireRoles } from "../middleware/role";

const router = Router();

router.get("/", listPublicVendors);
router.get("/match", matchVendorsByPincode);
router.get("/admin/all", authMiddleware, requireRoles(["SUPERADMIN"]), listAdminVendors);
router.get("/:id", getVendorById);
router.post("/:id/approve", authMiddleware, requireRoles(["SUPERADMIN"]), approveVendor);
router.post("/:id/reject", authMiddleware, requireRoles(["SUPERADMIN"]), rejectVendor);

export default router;