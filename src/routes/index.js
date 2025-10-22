import express from 'express';
import userRoutes from './user.routes.js';
const router = express.Router();
// Example route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the CareFlow EHR API' });
});
// redirect to user routes
router.use('/users', userRoutes);
export default router;
