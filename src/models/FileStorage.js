import mongoose from "mongoose";

const FileStorageSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  url: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['image', 'pdf', 'csv', 'document', 'other'], 
    default: 'document' 
  },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  relatedModel: { 
    type: String, 
    enum: ['Patient', 'Consultation', 'LabOrder', 'Prescription'], 
    required: true 
  },
  relatedId: { type: mongoose.Schema.Types.ObjectId, required: true },
  secureAccess: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("FileStorage", FileStorageSchema);
