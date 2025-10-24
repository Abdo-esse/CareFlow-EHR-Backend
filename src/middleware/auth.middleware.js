import { verifyToken } from "../services/jwt.service.js";
import { UnauthorizedError, AppError } from "../core/AppError.js";
import { isTokenRevoked } from "../services/redis.service.js";

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  const token = authHeader.split(" ")[1];
// Vérifier si le token est révoqué
  if (await isTokenRevoked(token)) {
    return res.status(403).json({ message: "Token révoqué" });
  }
  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    // ✅ Gestion spécifique du token expiré
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
