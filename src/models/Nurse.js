import mongoose from "mongoose";

const nurseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  department: String,
  shiftType: { type: String, enum: ["day", "night", "mixed"], default: "day" },
  availability: [
    {
      dayOfWeek: String,
      startTime: String,
      endTime: String,
      breaks: [{ start: String, end: String }]
    }
  ],
  vacations: [{ startDate: Date, endDate: Date, reason: String }],
}, { timestamps: true });

export default mongoose.model("Nurse", nurseSchema);
