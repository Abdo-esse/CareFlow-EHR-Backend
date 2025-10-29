import express from 'express';
import userRoutes from './user.routes.js';
import authRoutes from './auth.routes.js';
import clinicRoutes from './clinic.route.js';
import appointment from './appointment.route.js';
import consultationRoutes from './consultation.routes.js';
const router = express.Router();
// Example route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the CareFlow EHR API' });
});
// redirect to user routes
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/clinics', clinicRoutes);
router.use('/appointments', appointment);
router.use('/consultations', consultationRoutes);
export default router;
