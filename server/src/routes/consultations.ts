import express from 'express';
import { body, validationResult } from 'express-validator';

import {
  getConsultations,
  getConsultation,
  getMyConsultations,
  createConsultation,
  updateConsultation,
  deleteConsultation
} from '../controllers/consultations';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes for logged in user's own consultations
router.get('/me', getMyConsultations);

// Admin only routes
router.get('/', authorize('Admin'), getConsultations);
router.delete('/:id', authorize('Admin'), deleteConsultation);

// Routes accessible by consultation owner (patient or doctor) or admin
router.get('/:id', getConsultation);

// Validation middleware for creating a consultation
const validateCreateConsultation = [
  body('appointment_id').notEmpty().withMessage('Appointment ID is required'),
  body('notes').isString().notEmpty().withMessage('Notes are required'),
  body('diagnosis').isString().notEmpty().withMessage('Diagnosis is required'),
  body('prescription_id').optional().isString(),
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }
    next();
  }
];

// Validation middleware for updating a consultation
const validateUpdateConsultation = [
  body('notes').optional().isString(),
  body('diagnosis').optional().isString(),
  body('prescription_id').optional().isString(),
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }
    next();
  }
];

// Routes for doctors only
router.post('/', authorize('Doctor'), validateCreateConsultation, createConsultation);
router.put('/:id', validateUpdateConsultation, updateConsultation); // Access control in controller

export default router;