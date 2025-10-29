import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import { AppError, BadRequestError, NotFoundError, ConflictError } from "../core/AppError.js";

// Fonction pour parser "HH:mm" en minutes depuis minuit
const parseTimeStringToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

// Vérifie si une date est dans une plage horaire
const isWithinTimeRange = (date, startStr, endStr) => {
  const totalMinutes = date.getUTCHours() * 60 + date.getUTCMinutes();
  const startMinutes = parseTimeStringToMinutes(startStr);
  const endMinutes = parseTimeStringToMinutes(endStr);
  return totalMinutes >= startMinutes && totalMinutes <= endMinutes;
};

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const createAppointment = async (appointmentData) => {
  try {
    const { doctorId, patientId, clinicId, specialtyId, startTime, endTime } = appointmentData;

    // Vérifier que le médecin existe
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw new NotFoundError("Médecin non trouvé");

    // Vérifier que le médecin a la spécialité demandée
    if (doctor.specialtyId.toString() !== specialtyId) {
      throw new BadRequestError("Le médecin n'a pas cette spécialité");
    }

    const appointmentStart = new Date(startTime);
    const appointmentEnd = new Date(endTime);
    const dayOfWeek = dayNames[appointmentStart.getUTCDay()];

    // Vérifier les vacations
    const onVacation = doctor.vacations.some(v => 
      appointmentStart >= v.startDate && appointmentStart <= v.endDate
    );
    if (onVacation) throw new ConflictError("Le médecin est en vacances à cette date");

    // Vérifier la disponibilité du médecin
    const doctorAvailability = doctor.availability.find(avail => avail.dayOfWeek === dayOfWeek);
    if (!doctorAvailability) throw new ConflictError("Le médecin n'est pas disponible ce jour-là");

    if (!isWithinTimeRange(appointmentStart, doctorAvailability.startTime, doctorAvailability.endTime)) {
      throw new ConflictError("Le médecin n'est pas disponible à cette heure");
    }

    // Vérifier les pauses du docteur
    for (let br of doctorAvailability.breaks) {
      const breakStart = parseTimeStringToMinutes(br.start);
      const breakEnd = parseTimeStringToMinutes(br.end);
      const apptStartMin = appointmentStart.getUTCHours() * 60 + appointmentStart.getUTCMinutes();
      const apptEndMin = appointmentEnd.getUTCHours() * 60 + appointmentEnd.getUTCMinutes();
      if (apptStartMin < breakEnd && apptEndMin > breakStart) {
        throw new ConflictError("Le rendez-vous tombe pendant une pause du médecin");
      }
    }

    // Vérifier conflits pour le docteur
    const existingDoctorAppt = await Appointment.findOne({
      doctorId,
      clinicId,
      $or: [
        { startTime: { $lt: appointmentEnd, $gte: appointmentStart } },
        { endTime: { $gt: appointmentStart, $lte: appointmentEnd } },
        { startTime: { $lte: appointmentStart }, endTime: { $gte: appointmentEnd } }
      ]
    });
    if (existingDoctorAppt) throw new ConflictError("Un rendez-vous existe déjà pour ce médecin à cette date et heure");

    // Vérifier conflits pour le patient
    const existingPatientAppt = await Appointment.findOne({
      patientId,
      $or: [
        { startTime: { $lt: appointmentEnd, $gte: appointmentStart } },
        { endTime: { $gt: appointmentStart, $lte: appointmentEnd } },
        { startTime: { $lte: appointmentStart }, endTime: { $gte: appointmentEnd } }
      ]
    });
    if (existingPatientAppt) throw new ConflictError("Le patient a déjà un rendez-vous à cette date et heure");

    // Créer le rendez-vous
    const newAppointment = await Appointment.create(appointmentData);

    return newAppointment;
    
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new BadRequestError(error.message);
  }
};

export const getAppointmentByStatus = async (status, clinicId, filter = {}) => {
  try {
    
    const query = { status };
    if (clinicId) query.clinicId = clinicId;
    Object.assign(query, filter); 
    const appointments = await Appointment.find(query);
    if (!appointments.length) {
      throw new NotFoundError("Aucun rendez-vous trouvé avec ce statut");
    }
    return appointments;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new BadRequestError(error.message);
    
  }
  
};
