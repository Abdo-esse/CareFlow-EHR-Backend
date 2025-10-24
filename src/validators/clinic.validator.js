import Joi from "joi";

export const clinicCreateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Le nom de la clinique est obligatoire.",
    "string.min": "Le nom doit contenir au moins 2 caractères.",
    "string.max": "Le nom ne doit pas dépasser 100 caractères.",
  }),

  address: Joi.string().allow("", null),
  contactEmail: Joi.string().email().allow("", null).messages({
    "string.email": "Email de contact invalide.",
  }),
  contactPhone: Joi.string()
    .pattern(/^[0-9+\s-]{6,20}$/)
    .allow("", null)
    .messages({
      "string.pattern.base": "Numéro de téléphone invalide.",
    }),
  licenseNumber: Joi.string().allow("", null),
});
