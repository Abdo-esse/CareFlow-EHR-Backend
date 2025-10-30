
import logger from '../utils/logger.js';
import { createClinic, getClinic, getAllClinics, deleteClinic } from './../services/clinic.service.js';


export const createClinicController = async (req, res, next) => {   
    try {

        const newClinic = await createClinic(req.body, req.file);
        logger.info(`Clinique créée : ${newClinic.name} par l'utilisateur : ${req.user.email}`);
        return res.status(201).json({
            message: "Clinique créée avec succès",
            clinic: newClinic
        });
    } catch (error) {
        next(error);
    }   
};

export const getClinicController = async (req, res, next) => {
    try {
        const clinicId = req.params.id;
        const clinic = await getClinic(clinicId);
        return res.status(200).json({
            message: "Clinique récupérée avec succès",
            clinic
        });
    } catch (error) {
        next(error);
    }
};


export const getAllClinicsController = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getAllClinics(page, limit);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


export const deleteClinicController = async (req, res, next) => {
  try {
    const clinicId = req.params.id;
    const deletedClinic = await deleteClinic(clinicId);
    res.status(200).json({
      message: "Clinique supprimée avec succès",
      clinic: deletedClinic
    });
  } catch (error) {
    next(error);
  }
};
