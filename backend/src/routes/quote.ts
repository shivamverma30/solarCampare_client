import { Router } from "express";
import { createQuoteRequest, listQuoteRequests } from "../controllers/quote";
import { authMiddleware } from "../middleware/auth";
import { requireRoles } from "../middleware/role";

const router = Router();

router.post("/request", createQuoteRequest);
router.get("/admin", authMiddleware, requireRoles(["SUPERADMIN", "ADMIN"]), listQuoteRequests);

export default router;
