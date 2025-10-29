import Consultation from "../models/Consultation.js";
import Appointment from "../models/Appointment.js";
import MedicalRecord from "../models/MedicalRecord.js";
import { uploadToMinio } from "./minio.service.js";
import { NotFoundError, BadRequestError, ConflictError } from "../core/AppError.js";


export const createConsultation = async (data, files = []) => {
  const { appointmentId, doctorId, patientId, vitals, diagnosis, procedures, notes } = data;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw new NotFoundError("Appointment introuvable.");

  if (appointment.patientId.toString() !== patientId) {
    throw new BadRequestError("Le patient fourni ne correspond pas à l'appointment.");
  }

  const existing = await Consultation.findOne({ appointmentId });
  if (existing) throw new ConflictError("Une consultation existe déjà pour cet appointment.");

  const attachments = [];
  if (files && files.length) {
    for (const file of files) {
      const uploaded = await uploadToMinio({
        file,
        clinicId: appointment.clinicId,
        patientId,
        folder: "consultation-attachments",
      });
      attachments.push({
        fileName: uploaded.fileName,
        fileType: uploaded.fileType,
        fileUrl: uploaded.fileUrl,
      });
    }
  }

  const consultation = await Consultation.create({
    appointmentId,
    doctorId,
    patientId,
    vitals: vitals || {},
    diagnosis: diagnosis || "",
    procedures: procedures || [],
    notes: notes || "",
    attachments,
  });

  appointment.status = "completed";
  await appointment.save();

  let record = await MedicalRecord.findOne({ patientId });
  if (!record) {
    record = await MedicalRecord.create({
      patientId,
      consultations: [consultation._id],
      lastUpdated: new Date(),
    });
  } else {
    record.consultations.push(consultation._id);
    record.lastUpdated = new Date();
    await record.save();
  }

  return consultation;
};
