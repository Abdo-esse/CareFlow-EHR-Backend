import User from '../models/User.model.js';
import { hashPassword } from '../utils/passwordUtils.js';
import { AppError, BadRequestError, ConflictError } from '../core/AppError.js';

export const getUser = async (id) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    } catch (error) {
        throw new Error("Server error");
    }
};

export const createUser = async (userData) => {
  try {
    const existingUser = await User.findOne({
      $or: [ { email: userData.email }, { phone: userData.phone }]
    });

    if (existingUser) {
      throw new ConflictError("Email ou téléphone déjà utilisé.");
    }
    const newUser = new User(userData);
    newUser.password = await hashPassword(userData.password);

    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return userResponse;

  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new BadRequestError(error.message);
  }
};
export const updateUser = async (id, updateData) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedUser) {
            throw new Error("User not found");
        }
        return updatedUser;
    } catch (error) {
        throw new Error("Server error");
    }
};
export const deleteUser = async (id) => {
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            throw new Error("User not found");
        }
        return deletedUser;
    } catch (error) {
        throw new Error("Server error");
    }
};

export const getPaginatedUsers = async (page, limit) => {
    try {
        const users = await User.find()
            .skip((page - 1) * limit)
            .limit(limit);
        const totalUsers = await User.countDocuments();
        return {
            users,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page
        };
    } catch (error) {
        throw new Error("Server error");
    }
};
