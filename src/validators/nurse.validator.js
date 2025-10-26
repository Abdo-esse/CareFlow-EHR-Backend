import Joi from "joi";
import mongoose from "mongoose";

export const nurseValidationSchema = Joi.object({
  userId: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value))
        return helpers.error("any.invalid");
      return value;
    })
    .messages({ "any.invalid": "userId doit être un ObjectId valide." }),

  department: Joi.string().allow("", null),

  shiftType: Joi.string().valid("day", "night", "mixed").default("day"),

  availability: Joi.array().items(
    Joi.object({
      dayOfWeek: Joi.string().required(),
      startTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
      endTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
      breaks: Joi.array().items(
        Joi.object({
          start: Joi.string().pattern(/^\d{2}:\d{2}$/),
          end: Joi.string().pattern(/^\d{2}:\d{2}$/),
        })
      ),
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
