import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true 
  },
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
  },
  clinicId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Clinic', 
    required: true 
  },
  nurseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Nurse" 
  },
  specialtyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Specialty', 
    required: true 
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  reason: { type: String, trim: true },
  status: { 
    type: String, 
    enum: ['scheduled', 'completed', 'cancelled', 'no_show'], 
    default: 'scheduled' 
  },
  notes: { type: String, trim: true }
}, 
{ timestamps: true }
);

// ✅ Index pour éviter les conflits de rendez-vous
AppointmentSchema.index(
  { doctorId: 1, clinicId: 1, startTime: 1, endTime: 1 },
  { unique: true }
);

export default mongoose.model("Appointment", AppointmentSchema);
