import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
  name: { 
    type: String, 
    enum: ['admin', 'doctor', 'patient', 'pharmacist', 'lab_technician'],
    required: true 
  },
  description: String,
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
}, { timestamps: true });

export default mongoose.model("Role", RoleSchema);
