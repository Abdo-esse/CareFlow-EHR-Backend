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


export const deleteClinic = async (clinicId) => {
  try {
    const deletedClinic = await Clinic.findByIdAndDelete(clinicId);
    if (!deletedClinic) {
      throw new NotFoundError("Clinique introuvable.");
    }
    return deletedClinic;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new BadRequestError(error.message);
  }
};

export const getAllClinics = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    const clinics = await Clinic.find()
      .skip(skip)
      .limit(limit);

    const totalClinics = await Clinic.countDocuments();

    return {
      clinics,
      totalPages: Math.ceil(totalClinics / limit),
      currentPage: page,
      totalClinics,
    };
  } catch (error) {
    throw new BadRequestError("Erreur serveur lors de la récupération des cliniques.");
  }
};
