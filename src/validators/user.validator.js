import Joi from "joi";
import mongoose from "mongoose";

export const userRegisterSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).required().messages({
    "string.empty": "Le prénom est obligatoire.",
    "string.min": "Le prénom doit contenir au moins 2 caractères."
  }),

  lastName: Joi.string().min(2).max(30).required().messages({
    "string.empty": "Le nom est obligatoire.",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Email invalide.",
    "any.required": "L'email est obligatoire."
  }),

  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])"))
    .required()
    .messages({
      "string.min": "Le mot de passe doit contenir au moins 8 caractères.",
      "string.pattern.base":
        "Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial."
    }),

  phone: Joi.string()
    .pattern(/^[0-9+\-\s]+$/)
    .allow("", null)
    .messages({
      "string.pattern.base": "Le numéro de téléphone est invalide."
    }),

  address: Joi.string().allow("", null),

  clinicId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value))
        return helpers.error("any.invalid");
      return value;
    })
    .optional()
    .messages({ "any.invalid": "clinicId doit être un ObjectId valide." }),

  roleId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value))
        return helpers.error("any.invalid");
      return value;
    })
    .optional()
    .messages({ "any.invalid": "roleId doit être un ObjectId valide." }),

  isActive: Joi.boolean().optional(),
});
