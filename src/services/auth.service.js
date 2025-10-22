import User from "../models/User.model.js";
import { AppError, BadRequestError, NotFoundError } from "../core/AppError.js";

export      const login = async (email, password) => {
    try {
        const user = await User.findOne({ email }); 
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new AppError("Invalid credentials", 401);
        }
        return user;
    } catch (error) {   
        if (error instanceof AppError) throw error;
        throw new BadRequestError(error.message);
    }
};