import { createAppointment } from "../services/index.js";
import { AppError, BadRequestError } from "../core/AppError.js";
import {appointmentValidationSchema }   from "../validators/index.js";

// create appointment controller
export const createAppointmentController = async (req, res, next) => {
  try {
    const appointmentData = req.body;
    const currentUser = req.user;
    switch (currentUser.role) {
      case "Doctor":
        appointmentData.doctorId = currentUser.sub;
        break;
      case "Patient":
        appointmentData.patientId = currentUser.sub;
        break;
    }
    // Validate appointment data
    const { error, value } = appointmentValidationSchema.validate(appointmentData);
    if (error) {
      throw new BadRequestError(error);
    }
    const newAppointment = await createAppointment(value);
    res.status(201).json(newAppointment);
  } catch (error) {
   next(error);
  }
};
