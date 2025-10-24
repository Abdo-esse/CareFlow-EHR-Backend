
import logger from '../utils/logger.js';
import { createClinic } from './../services/clinic.service.js';


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

