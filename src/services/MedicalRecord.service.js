import MedicalRecord from "../models/MedicalRecord.js";
import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";
import { NotFoundError, BadRequestError } from "../core/AppError.js";


export const getMedicalRecordByPatient = async (patientId) => {
  try {
    const patient = await Patient.findById(patientId) .populate({
    path: 'userId',
    populate: { path: 'clinicId', model: 'Clinic' }
  });
    if (!patient) throw new NotFoundError("Patient introuvable");


    const appointments = await Appointment.find({ patientId }).populate('specialtyId');


    const record = await MedicalRecord.findOne({ patientId })
      .populate({
        path: "consultations",
        populate: [
          { path: "appointmentId", model: "Appointment" },
          { path: "doctorId", model: "Doctor" },
          { path: "patientId", model: "Patient", populate: { path: "userId", model: "User" } },
        ],
      });


    return { patient, appointments, record };

  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new BadRequestError(error.message);
  }
};
