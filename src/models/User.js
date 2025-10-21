import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  phone: String,
  address: String,
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
