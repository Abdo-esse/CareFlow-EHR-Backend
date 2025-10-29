import { userCreationSchema } from "../validators/user.validator.js";
import express from "express";
import { createUserController} from "../controllers/User.controller.js";
import {validate} from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/", validate(userCreationSchema), createUserController);

export default router;
