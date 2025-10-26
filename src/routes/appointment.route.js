import {createAppointmentController } from "../controllers/Appointment.controller.js";
import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/", authMiddleware, createAppointmentController);

export default router;