import User from "../models/User.js";
import { AppError, BadRequestError, NotFoundError, ForbiddenError } from "../core/AppError.js";
import { comparePassword } from "../utils/passwordUtils.js";
import { verifyRefreshToken, generateAccessToken, verifyToken} from "./jwt.service.js";
import RefreshToken from "../models/RefreshToken.js";
import { revokeToken } from "./redis.service.js";



export const login = async (email, password) => {
    try {
        const user = await User.findOne({ email }).populate('roleId'); 
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            throw new AppError("Invalid credentials", 401);
        }
        //return user without password
        delete user.password;
        return user;
    } catch (error) {   
        if (error instanceof AppError) throw error;
        throw new BadRequestError(error.message);
    }
};

export const refreshToken= async (token) => {
    try {
        const decoded = await verifyRefreshToken(token);
        const user = await User.findById(decoded.id).populate('roleId');
        if (!user) {
            throw new NotFoundError("User not found");
        }
        // Generate a new access token
        const newAccessToken = generateAccessToken(user);
        return { accessToken: newAccessToken, email: user.email };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new BadRequestError(error.message);
    }
};

export const logout = async (token, refreshToken) => {
    try {
        const decodedAccess = await verifyToken(token);
        const decodedRefresh = await verifyRefreshToken(refreshToken);
        if (decodedAccess && decodedAccess.jti) {
            await revokeToken(decodedAccess.jti,decodedAccess.exp);
        }
        if(decodedRefresh) {
            await RefreshToken.deleteOne({ token: refreshToken });
        }
       return true;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new BadRequestError(error.message);
    }
};
