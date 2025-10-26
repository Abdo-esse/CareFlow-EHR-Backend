import Joi from "joi";
import mongoose from "mongoose";

export const patientValidationSchema = Joi.object({
  userId: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value))
        return helpers.error("any.invalid");
      return value;
    })
    .messages({ "any.invalid": "userId doit être un ObjectId valide." }),

  dateOfBirth: Joi.date().optional(),

  gender: Joi.string().valid("male", "female", "other").optional(),

  bloodType: Joi.string()
    .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
    .optional(),

  allergies: Joi.array().items(Joi.string()).optional(),

  chronicDiseases: Joi.array().items(Joi.string()).optional(),

  emergencyContact: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().pattern(/^[0-9+\-\s]+$/).required(),
    relation: Joi.string().required(),
  }).optional(),

  insurance: Joi.object({
    company: Joi.string().allow("", null),
    policyNumber: Joi.string().allow("", null),
  }).optional(),
});
