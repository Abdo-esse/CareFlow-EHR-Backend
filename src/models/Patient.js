import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateOfBirth: Date,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  bloodType: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  allergies: [String],
  chronicDiseases: [String],
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  insurance: {
    company: String,
    policyNumber: String,
  }
}, { timestamps: true });

export default mongoose.model("Patient", PatientSchema);
