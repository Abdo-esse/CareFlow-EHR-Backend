import mongoose from "mongoose";

const PharmacySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  phone: String,
  openingHours: String,
  email: String,
  partner: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Pharmacy", PharmacySchema);
