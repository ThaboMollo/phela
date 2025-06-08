import express from 'express';

import {
  getPrescriptions,
  getPrescription,
  getMyPrescriptions,
  createPrescription,
  updatePrescription,
  deletePrescription,
  getActivePrescriptions
} from '../controllers/prescriptions';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes for logged in user's own prescriptions
router.get('/me', getMyPrescriptions);

// Routes for active prescriptions
router.get('/active/:patientId', getActivePrescriptions);

// Admin only routes
router.get('/', authorize('Admin'), getPrescriptions);
router.delete('/:id', authorize('Admin'), deletePrescription);

// Routes accessible by prescription owner (patient or doctor) or admin
router.get('/:id', getPrescription);

// Routes for doctors only
router.post('/', authorize('Doctor'), createPrescription);
router.put('/:id', updatePrescription); // Access control in controller

export default router;