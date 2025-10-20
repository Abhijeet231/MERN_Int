import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { uploadAndDistribute } from "../controllers/distList.controller.js";
import { upload } from "../middleware/multer.middleware.js";

// Router instance
const router = Router();

// Endpoint to upload and distribute data
router.post("/upload", verifyJWT, upload.single("file"), uploadAndDistribute);

export default router;
