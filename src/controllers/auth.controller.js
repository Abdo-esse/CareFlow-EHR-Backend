import { findUserByEmail, createUser, getUser } from "../services/User.service.js";
import { login } from "../services/auth.service.js";
import { generateAccessToken, generateRefreshToken } from "../services/jwt.service.js";
import { BadRequestError } from "../core/AppError.js";
import logger from "../utils/logger.js";

export const registerController = async (req, res, next) => {
    try {
        const role = "Patient";
        const newUser = await createUser({ ...req.body, role });
        logger.info(`Nouvel utilisateur enregistré : ${newUser.email}`);
        return res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await login(email, password);
        console.log(user);
        if (!user) {
            throw new BadRequestError("Échec de la connexion");
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
            res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7 * 86400000,
            });
            logger.info(`Utilisateur connecté : ${user.email}`);
        return res.status(200).json({  message: "Connexion réussie", accessToken, user, refreshToken });
    } catch (error) {
        next(error);
    }
};
