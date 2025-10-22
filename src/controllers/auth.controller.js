import { findUserByEmail, createUser, getUser } from "../services/User.service.js";

export const registerController = async (req, res, next) => {
    try {
        const role = "Patient";
        const newUser = await createUser({ ...req.body, role });
        return res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

