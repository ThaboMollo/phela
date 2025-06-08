import express from 'express';
import { protect, authorize } from '../middleware/auth';

// Import route files
import appointments from './appointments';
import consultations from './consultations';
import facilities from './facilities';
import medicalProfiles from './medicalProfiles';
import prescriptions from './prescriptions';
import users from './users';

const router = express.Router();

// Ensure all admin routes require authentication and admin role
router.use(protect);
router.use(authorize('Admin'));

// Mount admin-facing routes
router.use('/users', users);
router.use('/appointments', appointments);
router.use('/consultations', consultations);
router.use('/facilities', facilities);
router.use('/medical-profiles', medicalProfiles);
router.use('/prescriptions', prescriptions);

export default router;