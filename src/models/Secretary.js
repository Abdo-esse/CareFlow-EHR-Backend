import mongoose from "mongoose";

const secretarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  department: String,
  assignedDoctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }]
}, { timestamps: true });

export default mongoose.model("Secretary", secretarySchema);
