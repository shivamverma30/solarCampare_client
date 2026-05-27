import { Router } from "express";
import { listCalculatorHistory, saveCalculatorHistory } from "../controllers/calculator";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/history", listCalculatorHistory);
router.post("/history", saveCalculatorHistory);

export default router;
