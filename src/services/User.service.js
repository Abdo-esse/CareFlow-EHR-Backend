import User from '../models/User.js';
import { hashPassword } from '../utils/passwordUtils.js';
import { AppError, BadRequestError, ConflictError, NotFoundError } from '../core/AppError.js';
import Role from '../models/Role.js';

export const getUser = async (id) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        return user;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new BadRequestError(error.message);
    }
};

export const createUser = async (userData, session=null) => {
  try {
    const existingUser = await User.findOne({
      $or: [ { email: userData.email }, { phone: userData.phone }]
    });

    if (existingUser) {
      throw new ConflictError("Email ou téléphone déjà utilisé.");
    }
    const newUser = new User(userData);
    if (userData.role){
        const role = await Role.findOne({ name: userData.role });
        if (!role) {
            throw new BadRequestError(`Role ${userData.role} does not exist`);
        }
        newUser.roleId = role._id;
    }
    newUser.password = await hashPassword(userData.password);

    await newUser.save({ session });
    // return user with role not roleId
    const userResponse = newUser.toObject();
    delete userResponse.password;
    userResponse.role = userData.role && userData.role;
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

export const getPaginatedUsers = async (page = 1, limit = 10, clinicId = null) => {
  try {
    const filter = clinicId ? { clinicId } : {};
    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);
    const totalUsers = await User.countDocuments(filter);

    return {
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page
    };
  } catch(error) {
    throw new BadRequestError("Erreur serveur lors de la récupération des utilisateurs");
  }
};

export const findUserByEmail = async (email) => {
    try {
         const user = await User.findOne({ email });
         if (!user) {
            throw new NotFoundError("User not found");
         }
         return user;
    } catch (error) {
       if (error instanceof AppError) throw error;
       throw new BadRequestError(error.message);
    }
};
