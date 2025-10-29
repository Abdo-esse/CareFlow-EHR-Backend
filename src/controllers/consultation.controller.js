import { createConsultation as createConsultationService } from "../services/consultation.service.js";
import { createConsultationSchema } from "../validators/consultation.validator.js";

export const createConsultationController = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (typeof body.vitals === "string") {
      try { body.vitals = JSON.parse(body.vitals); } catch (e) { /* ignore */ }
    }
    if (typeof body.procedures === "string") {
      try { body.procedures = JSON.parse(body.procedures); } catch (e) { /* ignore */ }
    }
    const { error } = createConsultationSchema.validate(body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ success: false, validationErrors: error.details.map(d => d.message) });
    }

    const consultation = await createConsultationService(body, req.files); 
    const obj = consultation.toObject();
    return res.status(201).json({ success: true, message: "Consultation créée", consultation: obj });
  } catch (err) {
    next(err);
  }
};