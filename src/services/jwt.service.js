import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';  
import  RefreshToken from '../models/RefreshToken.js';
import parseDuration from 'parse-duration';
import { ForbiddenError, NotFoundError } from '../core/AppError.js';

dotenv.config();

const JWT_PRIVATE_KEY = fs.readFileSync(path.resolve(process.env.JWT_PRIVATE_KEY_PATH));
const JWT_PUBLIC_KEY = fs.readFileSync(path.resolve(process.env.JWT_PUBLIC_KEY_PATH));

export const generateAccessToken = (user) => {
    const jti = uuidv4(); 
  const payload = {
    sub: user._id,
    email: user.email,
    role: user.roleId?.name || 'Unknown',
    clinicId: user.clinicId,
    jti, 
  };

  const token = jwt.sign(payload, JWT_PRIVATE_KEY, {
    algorithm: process.env.JWT_ALGO,
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
  });

  return token;
    
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_PUBLIC_KEY);
    } catch (error) {
        return null;
    }
};

export const generateRefreshToken = (user) => {
    if (!user ) {
        throw new Error("Payload invalide pour la génération du refresh token");
    }

    const tokenPayload = { id: user._id }; // objet simple

    const refreshToken = jwt.sign(
        tokenPayload,
        JWT_PRIVATE_KEY,
        { 
            algorithm: process.env.JWT_ALGO,
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES
        }
    );

    // Crée l’enregistrement en base
    RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + parseDuration(process.env.REFRESH_TOKEN_EXPIRES))
    });

    return refreshToken;
};

export const verifyRefreshToken = async (token) => {
    try {
        const storedToken = await RefreshToken.findOne({ token });
        if (!storedToken) {
            throw new NotFoundError("Refresh token not found");
        }
        return jwt.verify(token, JWT_PUBLIC_KEY);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new NotFoundError("Refresh token expired");
        }
        throw new ForbiddenError(`${error.name}: ${error.message}`);
    }
};
