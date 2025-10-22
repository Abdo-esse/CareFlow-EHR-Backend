import User from "../models/User.js";
import { AppError, BadRequestError, NotFoundError } from "../core/AppError.js";
import { comparePassword } from "../utils/passwordUtils.js";

export const login = async (email, password) => {
    try {
        const user = await User.findOne({ email }); 
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            throw new AppError("Invalid credentials", 401);
        }
        //return user without password
        user.password = undefined;
        return user;
    } catch (error) {   
        if (error instanceof AppError) throw error;
        throw new BadRequestError(error.message);
    }
};

