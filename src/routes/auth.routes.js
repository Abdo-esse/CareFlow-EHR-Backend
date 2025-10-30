import { userRegisterSchema } from "../validators/user.validator.js";
import { loginSchema } from "../validators/auth.validator.js";
import express from "express";
import { registerController, loginController, refreshTokenController, logoutController } from "../controllers/auth.controller.js";
import {validate} from "../middleware/validate.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Gestion de l'authentification et du profil utilisateur
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Enregistre un nouvel utilisateur (Patient)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Erreur de validation ou utilisateur déjà existant
 */
router.post("/register", validate(userRegisterSchema), registerController);


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connecte un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Connexion réussie
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Échec de la connexion
 */
router.post("/login", validate(loginSchema), loginController);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Rafraîchit le token d'accès à partir du refresh token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token d'accès rafraîchi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Refresh token invalide ou expiré
 */


router.post("/refresh-token", refreshTokenController);


/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Déconnecte un utilisateur
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Déconnexion réussie
 */
router.post("/logout", authMiddleware, logoutController);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Récupère le profil de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Non autorisé
 */

router.get("/profile", authMiddleware, (req, res) => {
    return res.status(200).json(req.user);
});


export default router;
