import { userRegisterSchema } from "../validators/user.validator.js";
import { loginController } from "../controllers/auth.controller.js";
import { loginSchema } from "../validators/auth.validator.js";
import express from "express";
import { registerController } from "../controllers/auth.controller.js";
import {validate} from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/register", validate(userRegisterSchema), registerController);
router.post("/login", validate(loginSchema), loginController);

export default router;
