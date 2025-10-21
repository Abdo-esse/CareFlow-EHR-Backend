import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
  date: { type: Date, required: true },
  reason: String,
  status: { 
    type: String, 
    enum: ['scheduled', 'completed', 'cancelled', 'no_show'], 
    default: 'scheduled' 
  },
}, { timestamps: true });

AppointmentSchema.index({ doctorId: 1, date: 1 }, { unique: true });

export default mongoose.model("Appointment", AppointmentSchema);
