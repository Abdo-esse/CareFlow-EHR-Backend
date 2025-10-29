import {createAppointmentController, getAppointmentByStatusController } from "../controllers/Appointment.controller.js";
import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/", authMiddleware, createAppointmentController);
router.get("/status/:status/:specialtyId?", authMiddleware, getAppointmentByStatusController);

export default router;