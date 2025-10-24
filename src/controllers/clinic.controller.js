
import logger from '../utils/logger.js';
import { createClinic } from './../services/clinic.service.js';


export const createClinicController = async (req, res, next) => {   
    try {
        console.log('Utilisateur dans la requête :', req.user);

        const newClinic = await createClinic(req.body, req.file);
        // Journaliser la création de la clinique avec l'email de l'utilisateur
        console.log(`Clinique créée : ${newClinic.name} par l'utilisateur : ${req.user}`);
        // logger.info(`Clinique créée : ${newClinic.name} par l'utilisateur : ${req.user.email}`);
        return res.status(201).json({
            message: "Clinique créée avec succès",
            clinic: newClinic
        });
    } catch (error) {
        next(error);
    }   
};

