import express from "express";
import { createConsultationController } from "../controllers/consultation.controller.js";
import { uploadFile } from "../middleware/upload.middleware.js";


const router = express.Router();

router.post("/", uploadFile.array("files", 5), createConsultationController);

export default router;