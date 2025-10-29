import Joi from "joi";
import mongoose from "mongoose";

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) return helpers.error("any.invalid");
  return value;
}, "ObjectId validation");

export const createConsultationSchema = Joi.object({
  appointmentId: objectId.required(),
  doctorId: objectId.required(),
  patientId: objectId.required(),
  vitals: Joi.object({
    bloodPressure: Joi.string().allow("", null),
    heartRate: Joi.number().optional(),
    temperature: Joi.number().optional(),
    weight: Joi.number().optional(),
    height: Joi.number().optional(),
  }).optional(),
  diagnosis: Joi.string().allow("", null),
  procedures: Joi.array().items(Joi.string()).optional(),
  notes: Joi.string().allow("", null),
});
