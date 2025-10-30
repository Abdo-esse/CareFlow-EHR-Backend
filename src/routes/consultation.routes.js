import express from "express";
import { createConsultationController } from "../controllers/consultation.controller.js";
import { uploadFile } from "../middleware/upload.middleware.js";


const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Consultations
 *     description: Gestion des consultations médicales
 */

/**
 * @swagger
 * /api/v1/consultations:
 *   post:
 *     summary: Créer une consultation médicale
 *     description: Permet de créer une consultation liée à un rendez-vous existant. Les fichiers (images, rapports, etc.) peuvent être joints.
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - appointmentId
 *               - doctorId
 *               - patientId
 *             properties:
 *               appointmentId:
 *                 type: string
 *                 example: 672e9f5d6a4b3a9f1a9f5d2c
 *               doctorId:
 *                 type: string
 *                 example: 672e9f5d6a4b3a9f1a9f5d2c
 *               patientId:
 *                 type: string
 *                 example: 672e9f5d6a4b3a9f1a9f5d2c
 *               vitals:
 *                 type: object
 *                 example:
 *                   height: 175
 *                   weight: 70
 *                   temperature: 36.8
 *                   bloodPressure: "120/80"
 *               diagnosis:
 *                 type: string
 *                 example: Infection respiratoire légère
 *               procedures:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Radiographie thoracique
 *                     code:
 *                       type: string
 *                       example: XR-001
 *               notes:
 *                 type: string
 *                 example: Patient à revoir dans 7 jours.
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Consultation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Consultation créée
 *                 consultation:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     appointmentId:
 *                       type: string
 *                     doctorId:
 *                       type: string
 *                     patientId:
 *                       type: string
 *                     vitals:
 *                       type: object
 *                     diagnosis:
 *                       type: string
 *                     attachments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           fileName:
 *                             type: string
 *                           fileUrl:
 *                             type: string
 *       400:
 *         description: Erreur de validation
 *       404:
 *         description: Appointment introuvable
 *       409:
 *         description: Consultation déjà existante
 */


router.post("/", uploadFile.array("files", 5), createConsultationController);

export default router;