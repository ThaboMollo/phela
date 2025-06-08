import express from 'express';
import { body, validationResult } from 'express-validator';

import {
  getFacilities,
  getFacility,
  createFacility,
  updateFacility,
  deleteFacility,
  getFacilitiesInRadius
} from '../controllers/facilities';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Validation middleware for creating a facility
const validateCreateFacility = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('address').isString().notEmpty().withMessage('Address is required'),
  body('latitude').isNumeric().withMessage('Latitude must be a number'),
  body('longitude').isNumeric().withMessage('Longitude must be a number'),
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }
    next();
  }
];

// Validation middleware for updating a facility
const validateUpdateFacility = [
  body('name').optional().isString(),
  body('address').optional().isString(),
  body('latitude').optional().isNumeric(),
  body('longitude').optional().isNumeric(),
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }
    next();
  }
];

// Public routes
router.get('/', getFacilities);
router.get('/:id', getFacility);
router.get('/radius/:latitude/:longitude/:distance', getFacilitiesInRadius);

// Protected routes (Admin only)
router.post('/', protect, authorize('Admin'), validateCreateFacility, createFacility);
router.put('/:id', protect, authorize('Admin'), validateUpdateFacility, updateFacility);
router.delete('/:id', protect, authorize('Admin'), deleteFacility);

export default router;