import Clinic from "../models/Clinic.js";
import { NotFoundError, BadRequestError, ConflictError } from "../core/AppError.js";
import { uploadToMinio } from "./minio.service.js";

export const createClinic = async (clinicData, logo) => {
    console.log("Creating clinic with data:", clinicData);
  const newClinic = new Clinic(clinicData);
  //ckeck if clinic with same name exists or licenseNumber
  const existingClinic = await Clinic.findOne({
    $or: [{ name: clinicData.name }, { licenseNumber: clinicData.licenseNumber }],
  });
  if (existingClinic) {
      throw new ConflictError("Une clinique avec le même nom ou numéro de licence existe déjà.");
    }

    const savedClinic = await newClinic.save();
  // upload file to minio if logo is provided
  if (logo) {
    const logoUrl = await uploadToMinio({
      file: logo,
      clinicId: newClinic._id,
      folder: "logos",
    });
    savedClinic.logo = logoUrl;
  }
  //save clinic with logo url
  console.log(savedClinic)
  await savedClinic.save();
  return savedClinic;
};