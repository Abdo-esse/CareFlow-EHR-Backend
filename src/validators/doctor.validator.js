import Joi from "joi";
import mongoose from "mongoose";


// Fonction pour valider ObjectId
const objectId = () => Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId Validation");

export const doctorValidationSchema = Joi.object({
  userId: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value))
        return helpers.error("any.invalid");
      return value;
    })
    .messages({ "any.invalid": "userId doit être un ObjectId valide." }),

  specialtyId: objectId().required(),

  licenseNumber: Joi.string().allow("", null),

  consultationDuration: Joi.number().min(10).max(120).default(30),

  availability: Joi.array().items(
    Joi.object({
      dayOfWeek: Joi.string()
        .valid("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
        .required(),
      startTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
      endTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
      breaks: Joi.array()
        .items(
          Joi.object({
            start: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
            end: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
          })
        )
        .optional(),
    })
  ),

  vacations: Joi.array().items(
    Joi.object({
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      reason: Joi.string().allow("", null),
    })
  ),
});
