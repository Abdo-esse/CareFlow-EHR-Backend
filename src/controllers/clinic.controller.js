
import logger from '../utils/logger.js';
import { createClinic, getClinic } from './../services/clinic.service.js';


export const createClinicController = async (req, res, next) => {   
    try {

        const newClinic = await createClinic(req.body, req.file);
        // Journaliser la création de la clinique avec l'email de l'utilisateur
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


