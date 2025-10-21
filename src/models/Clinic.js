import mongoose from "mongoose";

const ClinicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  contactEmail: String,
  contactPhone: String,
  licenseNumber: String,
  logo: String,
}, { timestamps: true });

export default mongoose.model("Clinic", ClinicSchema);
