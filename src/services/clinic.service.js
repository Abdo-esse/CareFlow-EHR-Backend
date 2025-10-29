import Clinic from "../models/Clinic.js";
import { NotFoundError, BadRequestError, ConflictError } from "../core/AppError.js";
import { uploadToMinio } from "./minio.service.js";

export const createClinic = async (clinicData, logo) => {
  const newClinic = new Clinic(clinicData);
  const existingClinic = await Clinic.findOne({
    $or: [{ name: clinicData.name }, { licenseNumber: clinicData.licenseNumber }],
  });
  if (existingClinic) {
      throw new ConflictError("Une clinique avec le même nom ou numéro de licence existe déjà.");
    }

    const savedClinic = await newClinic.save();
  // upload file to minio if logo is provided
  if (logo) {
    const uploadResult = await uploadToMinio({
      file: logo,
      clinicId: newClinic._id,
      folder: "logos",
    });
    savedClinic.logo = uploadResult.fileUrl;
  }
  await savedClinic.save();
  return savedClinic;
};


export const getClinic = async (clinicId) => {
   try {
        const clinic = await Clinic.findById(clinicId);
        if (!clinic) {
            throw new NotFoundError("Clinique introuvable.");
        }
        return clinic;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new BadRequestError(error.message);
    }
};