import { userRegisterSchema } from "../validators/user.validator.js";
import { loginSchema } from "../validators/auth.validator.js";
import express from "express";
import { registerController, loginController, refreshTokenController, logoutController } from "../controllers/auth.controller.js";
import {validate} from "../middleware/validate.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", validate(userRegisterSchema), registerController);
router.post("/login", validate(loginSchema), loginController);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", authMiddleware, logoutController);
router.get("/profile", authMiddleware, (req, res) => {
    return res.status(200).json(req.user);
});


export default router;
