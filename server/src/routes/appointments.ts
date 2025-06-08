import * as express from 'express';
import { RequestHandler } from 'express';

import {
  getAppointments,
  getAppointment,
  getMyAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsNeedingReminders,
  markReminderSent,
  getAppointmentsByFilter,
  getAppointmentStats
} from '../controllers/appointments';
import { protect, authorize } from '../middleware/auth';

const router = express.Router({ mergeParams: true });

// All routes require authentication
router.use(protect as unknown as RequestHandler);

// Routes for logged in user's own appointments
router.get('/me', getMyAppointments as unknown as RequestHandler);

// Admin only routes
router.get('/filter', authorize('Admin') as unknown as RequestHandler, getAppointmentsByFilter as unknown as RequestHandler);
router.get('/stats', authorize('Admin') as unknown as RequestHandler, getAppointmentStats as unknown as RequestHandler);
router.get('/', authorize('Admin') as unknown as RequestHandler, getAppointments as unknown as RequestHandler);
router.delete('/:id', authorize('Admin') as unknown as RequestHandler, deleteAppointment as unknown as RequestHandler);

// Reminder system routes (Admin only)
router.get('/reminders', authorize('Admin') as unknown as RequestHandler, getAppointmentsNeedingReminders as unknown as RequestHandler);
router.put('/:id/reminder-sent', authorize('Admin') as unknown as RequestHandler, markReminderSent as unknown as RequestHandler);

// Routes accessible by appointment owner (patient or doctor) or admin
router.post('/', createAppointment as unknown as RequestHandler);
router.get('/:id', getAppointment as unknown as RequestHandler);
router.put('/:id', updateAppointment as unknown as RequestHandler);

export default router;
