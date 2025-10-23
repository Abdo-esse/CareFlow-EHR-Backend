import { findUserByEmail, createUser, getUser } from "../services/User.service.js";
import { login, refreshToken, logout } from "../services/auth.service.js";
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
        return res.status(200).json({  message: "Connexion réussie", accessToken});
    } catch (error) {
        next(error);
    }
};

export const profileController = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await getUser(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};
export const refreshTokenController = async (req, res, next) => {
    try {
        const { refresh_token } = req.cookies;
       const { accessToken, email } = await refreshToken(refresh_token);
       logger.info(`Access token rafraîchi pour l'utilisateur : ${email}`);
       return res.status(200).json({ accessToken });
    } catch (error) {
        next(error);
    }
};

export const logoutController = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const refreshToken = req.cookies.refresh_token;
        await logout(authHeader, refreshToken);
        res.clearCookie("refresh_token");
        return res.status(200).json({ message: "Déconnexion réussie" });
    } catch (error) {
        next(error);
    }
};      