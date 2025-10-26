import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  specialtyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Specialty', 
    required: true 
  },
  licenseNumber: String,
  consultationDuration: { type: Number, default: 30 }, // minutes
  availability: [
    {
      dayOfWeek: { type: String, enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
      startTime: String,
      endTime: String,
      breaks: [{ start: String, end: String }]
    }
  ],
  vacations: [{ startDate: Date, endDate: Date, reason: String }],
}, { timestamps: true });

export default mongoose.model("Doctor", doctorSchema);
