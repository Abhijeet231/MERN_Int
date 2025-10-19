import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { uploadAndDistribute } from "../controllers/distList.controller.js";
import {upload} from "../middleware/multer.middleware.js"

const router = Router();

router.post("/upload", verifyJWT, upload.single("file"), uploadAndDistribute);

export default router;

