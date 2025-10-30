import { userCreationSchema } from "../validators/user.validator.js";
import {validate} from "../middleware/validate.middleware.js";
import express from "express";
import { 
  createUserController,
  updateUserController,
  deleteUserController,
  getPaginatedUsersController
} from "../controllers/User.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Gestion des utilisateurs et rôles associés (Patient, Doctor, Nurse, Secretary)
 *
 * components:
 *   schemas:
 *     UserBase:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           example: "Alice"
 *         lastName:
 *           type: string
 *           example: "Smith"
 *         email:
 *           type: string
 *           example: "alice@hospital.com"
 *         password:
 *           type: string
 *           example: "SecurePass123!"
 *         role:
 *           type: string
 *           enum: [Doctor, Patient, Nurse, Secretary]
 *           example: "Doctor"
 *     DoctorData:
 *       type: object
 *       properties:
 *         specialtyId:
 *           type: string
 *           example: "64f123456789abcdef123456"
 *         licenseNumber:
 *           type: string
 *           example: "DOC-123456"
 *         consultationDuration:
 *           type: integer
 *           example: 30
 *     PatientData:
 *       type: object
 *       properties:
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "1990-05-22"
 *         gender:
 *           type: string
 *           enum: [male, female]
 *           example: "male"
 *         bloodType:
 *           type: string
 *           example: "O+"
 *         allergies:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Pollen", "Dust"]
 *     NurseData:
 *       type: object
 *       properties:
 *         department:
 *           type: string
 *           example: "Emergency"
 *         shiftType:
 *           type: string
 *           enum: [day, night, mixed]
 *           example: "night"
 *     SecretaryData:
 *       type: object
 *       properties:
 *         department:
 *           type: string
 *           example: "Reception"
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crée un nouvel utilisateur avec son rôle associé
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/UserBase'
 *               - type: object
 *                 properties:
 *                   doctorData:
 *                     $ref: '#/components/schemas/DoctorData'
 *                   patientData:
 *                     $ref: '#/components/schemas/PatientData'
 *                   nurseData:
 *                     $ref: '#/components/schemas/NurseData'
 *                   secretaryData:
 *                     $ref: '#/components/schemas/SecretaryData'
 *     responses:
 *       201:
 *         description: Utilisateur et entité liée créés avec succès
 *       400:
 *         description: Erreur de validation ou rôle invalide
 *       500:
 *         description: Erreur serveur
 *
 *   get:
 *     summary: Récupère les utilisateurs paginés, filtrés par clinicId si l'utilisateur courant en possède un
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page à récupérer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre d'utilisateurs par page
 *     responses:
 *       200:
 *         description: Liste paginée des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserBase'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Met à jour un utilisateur et son entité associée
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Doctor, Patient, Nurse, Secretary]
 *               doctorData:
 *                 $ref: '#/components/schemas/DoctorData'
 *               patientData:
 *                 $ref: '#/components/schemas/PatientData'
 *               nurseData:
 *                 $ref: '#/components/schemas/NurseData'
 *               secretaryData:
 *                 $ref: '#/components/schemas/SecretaryData'
 *     responses:
 *       200:
 *         description: Utilisateur et entité associée mis à jour
 *       400:
 *         description: Erreur de validation
 *       500:
 *         description: Erreur serveur
 *
 *   delete:
 *     summary: Supprime un utilisateur et son entité associée
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

router.post("/", validate(userCreationSchema), createUserController);
router.get("/", getPaginatedUsersController);
router.put("/:id", updateUserController);
router.delete("/:id", deleteUserController);

export default router;
