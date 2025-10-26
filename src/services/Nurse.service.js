import Nurse from "../models/Nurse.js";
import { AppError, BadRequestError, NotFoundError } from "../core/AppError.js";

// create nurse service
export const createNurse = async (nurseData) => {
  try { 
    // Vérifier si une infirmière existe déjà pour cet utilisateur
    const existingNurse = await Nurse.findOne({ userId: nurseData.userId });
    if (existingNurse) {
      throw new NotFoundError("Une infirmière existe déjà pour cet utilisateur");
    }   
    const newNurse = new Nurse(nurseData);
    await newNurse.save();
    return newNurse;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new BadRequestError(error.message);
  }
};