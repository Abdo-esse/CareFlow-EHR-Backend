import { userCreationSchema } from "../validators/user.validator.js";
import express from "express";
import { createUserController} from "../controllers/User.controller.js";
import {validate} from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/", validate(userCreationSchema), createUserController);
// router.get("/:id", getUserController);
// router.put("/:id", updateUserController);
// router.delete("/:id", deleteUserController);
// router.get("/", getPaginatedUsersController);

export default router;
