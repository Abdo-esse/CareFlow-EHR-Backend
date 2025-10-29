import mongoose from "mongoose";

const MedicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
    unique: true,
  },

  consultations: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Consultation" }
  ],

  prescriptions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Prescription" }
  ],

  labOrders: [
    { type: mongoose.Schema.Types.ObjectId, ref: "LabOrder" }
  ],

  imagingReports: [
    { type: mongoose.Schema.Types.ObjectId, ref: "RadiologyReport" }
  ],

  allergies: [String],
  chronicDiseases: [String],
  notes: String, 

  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });


// 🧩 Middleware pour mettre à jour automatiquement la date
MedicalRecordSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

export default mongoose.model("MedicalRecord", MedicalRecordSchema);
