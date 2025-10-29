
import Secretary from "../models/Secretary.js";
import { AppError, BadRequestError, NotFoundError } from "../core/AppError.js";

// create secretary service
export const createSecretary = async (secretaryData) => {
  try {
    const existingSecretary = await Secretary.findOne({ userId: secretaryData.userId });
    if (existingSecretary) {
      throw new NotFoundError("Un secrétaire existe déjà pour cet utilisateur");
    }
    const newSecretary = new Secretary(secretaryData);
    await newSecretary.save();
    return newSecretary;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new BadRequestError(error.message);
  }
};

