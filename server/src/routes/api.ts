import express from 'express';

// Import route files
import appointments from './appointments';
import auth from './auth';
import consultations from './consultations';
import facilities from './facilities';
import medicalProfiles from './medicalProfiles';
import prescriptions from './prescriptions';

const router = express.Router();

// Mount client-facing routes
router.use('/auth', auth);
router.use('/appointments', appointments);
router.use('/consultations', consultations);
router.use('/facilities', facilities);
router.use('/medical-profiles', medicalProfiles);
router.use('/prescriptions', prescriptions);

export default router;