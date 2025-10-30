import { getMedicalRecordByPatient } from "../services/MedicalRecord.service.js";

export const getMedicalRecordController = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const data = await getMedicalRecordByPatient(patientId);

    res.status(200).json({
      message: "MedicalRecord récupéré avec succès",
      patient: data.patient,
      appointments: data.appointments,
      medicalRecord: data.record
    });
  } catch (error) {
    next(error);
  }
};
