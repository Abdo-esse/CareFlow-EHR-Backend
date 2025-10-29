import Joi from 'joi';
import mongoose from 'mongoose';

// Fonction pour valider ObjectId
const objectId = () => Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId Validation");

// Schéma Joi pour la création ou mise à jour d'un rendez-vous
export const appointmentValidationSchema = Joi.object({
  patientId: objectId().required(),
  doctorId: objectId().required(),
  clinicId: objectId().required(),
  nurseId: objectId().optional(),
  specialtyId: objectId().required(),
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().required().greater(Joi.ref('startTime')), 
  reason: Joi.string().trim().max(500).optional(), 
  status: Joi.string()
    .valid('scheduled', 'completed', 'cancelled', 'no_show')
    .optional(),
  notes: Joi.string().trim().max(1000).optional()
});

// Schéma Joi pour getter les rendez-vous par statut
export const getAppointmentsByStatusSchema = Joi.object({
  status: Joi.string().valid('scheduled', 'completed', 'cancelled', 'no_show').required(),
  specialtyId: objectId().optional()
});