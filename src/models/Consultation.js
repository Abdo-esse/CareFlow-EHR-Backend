import mongoose from "mongoose";

const ConsultationSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  vitals: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    weight: Number,
    height: Number
  },
  diagnosis: String,
  procedures: [String],
  notes: String,
  attachments: [
    {
      fileName: String,
      fileType: String, 
      fileUrl: String   
    }
  ],
}, { timestamps: true });

export default mongoose.model("Consultation", ConsultationSchema);
