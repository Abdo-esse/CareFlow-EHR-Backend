import express from "express";
import { createClinicController, getAllClinicsController, getClinicController, deleteClinicController } from "../controllers/clinic.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { clinicCreateSchema } from "../validators/clinic.validator.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { uploadFile } from "../middleware/upload.middleware.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Clinics
 *     description: Gestion des cliniques
 */

/**
 * @swagger
 * /api/v1/clinics:
 *   post:
 *     summary: Créer une nouvelle clinique
 *     description: Cette route permet de créer une nouvelle clinique. L'utilisateur doit être authentifié avec un token JWT et peut envoyer un logo.
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - licenseNumber
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Clinique Hassan II"
 *               licenseNumber:
 *                 type: string
 *                 example: "LIC-12345"
 *               address:
 *                 type: string
 *                 example: "Rue de la Paix, Casablanca"
 *               phone:
 *                 type: string
 *                 example: "+212612345678"
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Clinique créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clinique créée avec succès
 *                 clinic:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "672e9f5d6a4b3a9f1a9f5d2c"
 *                     name:
 *                       type: string
 *                       example: "Clinique Hassan II"
 *                     licenseNumber:
 *                       type: string
 *                       example: "LIC-12345"
 *                     logo:
 *                       type: string
 *                       example: "https://minio.careflow.com/logos/clinique-hassan-ii.png"
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé (JWT manquant ou invalide)
 *       409:
 *         description: Clinique déjà existante
 */
router.post("/", authMiddleware,uploadFile.single("logo"),  validate(clinicCreateSchema), createClinicController);


/**
 * @swagger
 * /clinics:
 *   get:
 *     summary: Récupère toutes les cliniques avec pagination
 *     tags: [Clinics]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre de cliniques par page
 *     responses:
 *       200:
 *         description: Liste des cliniques paginée
 *       500:
 *         description: Erreur serveur
 */
router.get("/", getAllClinicsController);

/**
 * @swagger
 * /clinics/{id}:
 *   get:
 *     summary: Récupère une clinique par son ID
 *     tags: [Clinics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la clinique
 *     responses:
 *       200:
 *         description: Clinique récupérée avec succès
 *       404:
 *         description: Clinique non trouvée
 */
router.get("/:id", getClinicController);

/**
 * @swagger
 * /clinics/{id}:
 *   delete:
 *     summary: Supprime une clinique par son ID
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la clinique
 *     responses:
 *       200:
 *         description: Clinique supprimée avec succès
 *       404:
 *         description: Clinique non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", authMiddleware, deleteClinicController);


export default router;