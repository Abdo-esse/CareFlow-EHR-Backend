import mongoose from "mongoose";

const PrescriptionSchema = new mongoose.Schema({
  consultationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' },
  medications: [{
    name: String,
    dosage: String,
    route: String,
    frequency: String,
    duration: String,
    renewals: Number
  }],
  status: { 
    type: String, 
    enum: ['draft', 'signed', 'sent', 'dispensed'], 
    default: 'draft' 
  },
  notes: String,
}, { timestamps: true });

export default mongoose.model("Prescription", PrescriptionSchema);
