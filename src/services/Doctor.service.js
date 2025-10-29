import Doctor from "../models/Doctor.js";
import { AppError, BadRequestError, NotFoundError } from "../core/AppError.js";


export const createDoctor = async (doctorData) => {
  try {
    const existingDoctor = await Doctor.findOne({ userId: doctorData.userId });
    if (existingDoctor) {
      throw new NotFoundError("Un docteur existe déjà pour cet utilisateur");
    }
    const newDoctor = new Doctor(doctorData);
    await newDoctor.save();
    return newDoctor;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new BadRequestError(error.message);
  }
};