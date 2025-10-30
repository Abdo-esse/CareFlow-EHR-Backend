import express from "express";
import { getMedicalRecordController } from "../controllers/MedicalRecord.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: MedicalRecords
 *     description: Gestion des dossiers médicaux des patients
 */

/**
 * @swagger
 * /MedicalRecord/{patientId}:
 *   get:
 *     summary: Récupère le dossier médical complet d'un patient
 *     description: >
 *       Cet endpoint permet de récupérer toutes les informations d'un patient,
 *       y compris les consultations, rendez-vous, prescriptions, analyses, imageries et les données utilisateur avec la clinique associée.
 *       Toutes les références sont remplacées par les objets correspondants.
 *     tags: [MedicalRecords]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du patient dont on souhaite récupérer le dossier médical
 *     responses:
 *       200:
 *         description: Dossier médical récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "MedicalRecord récupéré avec succès"
 *                 patient:
 *                   type: object
 *                   description: Informations du patient avec données utilisateur et clinique
 *                 appointments:
 *                   type: array
 *                   description: Liste des rendez-vous du patient
 *                   items:
 *                     type: object
 *                 medicalRecord:
 *                   type: object
 *                   description: Dossier médical complet
 *                   properties:
 *                     consultations:
 *                       type: array
 *                       items:
 *                         type: object
 *                     prescriptions:
 *                       type: array
 *                       items:
 *                         type: object
 *                     labOrders:
 *                       type: array
 *                       items:
 *                         type: object
 *                     imagingReports:
 *                       type: array
 *                       items:
 *                         type: object
 *                     allergies:
 *                       type: array
 *                       items:
 *                         type: string
 *                     chronicDiseases:
 *                       type: array
 *                       items:
 *                         type: string
 *                     notes:
 *                       type: string
 *                     lastUpdated:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Patient ou dossier médical non trouvé
 *       500:
 *         description: Erreur serveur
 */

router.get("/:patientId", authMiddleware, getMedicalRecordController);

export default router;