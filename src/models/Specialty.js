import mongoose from "mongoose";
const SpecialtySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String
});

export default mongoose.model("Specialty", SpecialtySchema);