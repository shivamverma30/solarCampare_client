import { Router } from "express";
import { createUploadMetadata, listUploadMetadata, uploadDocumentFile } from "../controllers/upload";
import { authMiddleware } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

router.use(authMiddleware);

router.get("/", listUploadMetadata);
router.post("/metadata", createUploadMetadata);
router.post("/file", upload.single("file"), uploadDocumentFile);

export default router;
