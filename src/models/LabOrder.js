import mongoose from "mongoose";

const LabOrderSchema = new mongoose.Schema({
  consultationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  tests: [String],
  status: { 
    type: String, 
    enum: ['ordered', 'received', 'validated'], 
    default: 'ordered' 
  },
  labId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab' },
  resultsFile: String,
}, { timestamps: true });

export default mongoose.model("LabOrder", LabOrderSchema);
