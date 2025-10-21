import mongoose from "mongoose";

const PermissionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // ex: CREATE_PATIENT
  module: { type: String },               // ex: patient, consultation
  description: String,
}, { timestamps: true });

export default mongoose.model("Permission", PermissionSchema);
