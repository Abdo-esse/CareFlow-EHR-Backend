import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email invalide.",
    "any.required": "L'email est obligatoire."
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Le mot de passe doit contenir au moins 8 caractères."
  }),
});
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "any.required": "Le refreshToken est obligatoire."
  }),
});