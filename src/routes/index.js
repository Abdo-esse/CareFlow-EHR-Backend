import express from 'express';
import userRoutes from './user.routes.js';
import authRoutes from './auth.routes.js';
import clinicRoutes from './clinic.route.js';
import appointment from './appointment.route.js';
import consultationRoutes from './consultation.routes.js';
import medicalRecordRoutes from './medicalRecord.route.js';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the CareFlow EHR API' });
});

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/clinics', clinicRoutes);
router.use('/appointments', appointment);
router.use('/consultations', consultationRoutes);
router.use('/medicalRecords', medicalRecordRoutes);
export default router;
