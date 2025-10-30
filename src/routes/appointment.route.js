import {createAppointmentController, getAppointmentByStatusController } from "../controllers/Appointment.controller.js";
import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Appointments
 *     description: Gestion des rendez-vous médicaux
 */

/**
 * @swagger
 * /api/v1/appointments:
 *   post:
 *     summary: Créer un nouveau rendez-vous
 *     description: Permet à un patient ou un médecin de créer un rendez-vous. L'utilisateur doit être authentifié.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - patientId
 *               - clinicId
 *               - specialtyId
 *               - startTime
 *               - endTime
 *             properties:
 *               doctorId:
 *                 type: string
 *                 example: 672e9f5d6a4b3a9f1a9f5d2c
 *               patientId:
 *                 type: string
 *                 example: 672e9f5d6a4b3a9f1a9f5d2c
 *               clinicId:
 *                 type: string
 *                 example: 672e9f5d6a4b3a9f1a9f5d2c
 *               specialtyId:
 *                 type: string
 *                 example: 672e9f5d6a4b3a9f1a9f5d2c
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-01T09:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-01T09:30:00Z"
 *     responses:
 *       201:
 *         description: Rendez-vous créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 672e9f5d6a4b3a9f1a9f5d2c
 *                 doctorId:
 *                   type: string
 *                 patientId:
 *                   type: string
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Médecin non trouvé
 *       409:
 *         description: Conflit de disponibilité
 */


router.post("/", authMiddleware, createAppointmentController);

/**
 * @swagger
 * /api/v1/appointments/status/{status}/{specialtyId}:
 *   get:
 *     summary: Récupère les rendez-vous selon le statut
 *     description: Retourne la liste des rendez-vous selon le statut (par ex. pending, confirmed, cancelled). Optionnellement filtré par spécialité.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *         description: Statut du rendez-vous à rechercher
 *       - in: path
 *         name: specialtyId
 *         required: false
 *         schema:
 *           type: string
 *         description: ID de la spécialité (optionnel)
 *     responses:
 *       200:
 *         description: Liste des rendez-vous récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Appointments retrieved successfully
 *                 appointments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       doctorId:
 *                         type: string
 *                       patientId:
 *                         type: string
 *                       status:
 *                         type: string
 *                         example: confirmed
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Aucun rendez-vous trouvé
 */

router.get("/status/:status/:specialtyId?", authMiddleware, getAppointmentByStatusController);

export default router;