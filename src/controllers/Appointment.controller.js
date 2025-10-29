import { createAppointment, getAppointmentByStatus } from "../services/index.js";
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

export const getAppointmentByStatusController = async (req, res, next) => {
  try {
    const { status, specialtyId } = req.params;
    const currentUser = req.user;

    let filter = {};
    if (currentUser.role === "Doctor") filter.doctorId = currentUser.sub;
    if (currentUser.role === "Patient") filter.patientId = currentUser.sub;
    if (specialtyId) filter.specialtyId = specialtyId;

    const appointments = await getAppointmentByStatus(status, currentUser.clinicId, filter);

    return res.status(200).json({
      message: "Appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    next(error);
  }
};
