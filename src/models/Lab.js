import mongoose from "mongoose";

const LabSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  phone: String,
  email: String,
  licenseNumber: String,
  partner: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Lab", LabSchema);
