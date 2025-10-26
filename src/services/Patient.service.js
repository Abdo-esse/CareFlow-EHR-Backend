import Patient from "../models/Patient.js";
import { AppError, BadRequestError, NotFoundError } from "../core/AppError.js";



// create patient service
export const createPatient = async (patientData) => {
  try {
    const existingPatient = await Patient.findOne({ userId: patientData.userId });
    if (existingPatient) {
      throw new NotFoundError("Un patient existe déjà pour cet utilisateur");
    }
    const newPatient = new Patient(patientData);
    await newPatient.save();
    return newPatient;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new BadRequestError(error.message);
  }
};