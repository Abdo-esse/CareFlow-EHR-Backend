import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialty: String,
  licenseNumber: String,
  yearsOfExperience: Number,
  availableDays: [String],
  consultationFee: Number,
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
}, { timestamps: true });

export default mongoose.model("Doctor", DoctorSchema);
