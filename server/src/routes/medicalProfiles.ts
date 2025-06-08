import express from 'express';

import {
  getMedicalProfiles,
  getMedicalProfile,
  getMyMedicalProfile,
  createMedicalProfile,
  updateMedicalProfile,
  deleteMedicalProfile
} from '../controllers/medicalProfiles';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes for logged in user's own medical profile
router.get('/me', getMyMedicalProfile);

// Admin only routes
router
  .route('/')
  .get(authorize('Admin'), getMedicalProfiles)
  .post(authorize('Admin'), createMedicalProfile);

// Admin only route for deletion
router.delete('/:id', authorize('Admin'), deleteMedicalProfile);

// Routes accessible by profile owner, admin, or doctor (for viewing)
router
  .route('/:id')
  .get(getMedicalProfile)
  .put(updateMedicalProfile);

export default router;