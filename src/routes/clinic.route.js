import express from "express";
import { createClinicController } from "../controllers/clinic.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { clinicCreateSchema } from "../validators/clinic.validator.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { uploadFile } from "../middleware/upload.middleware.js";

const router = express.Router();
router.post("/", authMiddleware,uploadFile.single("logo"),  validate(clinicCreateSchema), createClinicController);
// router.get("/:id", authMiddleware, getClinicController);


export default router;