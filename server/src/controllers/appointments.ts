import { Request, Response } from 'express';

import Appointment, { IAppointment, AppointmentStatus } from '../models/Appointment';
import Facility from '../models/Facility';
import User from '../models/User';

// Type for appointment creation request body
interface CreateAppointmentRequestBody {
  patient_id?: string; // Optional because it can be set from the logged-in user
  doctor_id: string;
  facility_id: string;
  status?: AppointmentStatus;
  appointment_time: Date;
  reason: string;
  notes?: string;
}

// Type for appointment update request body (all fields optional)
interface UpdateAppointmentRequestBody {
  status?: AppointmentStatus;
  appointment_time?: Date;
  reason?: string;
  notes?: string;
  reminder_sent?: boolean;
}

// @desc    Get all appointments
// @route   GET /api/v1/appointments
// @access  Private/Admin
export const getAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find()
      .sort({ appointment_time: 1 })
      .populate('patient_id', 'full_name email phone_number')
      .populate('doctor_id', 'full_name email phone_number')
      .populate('facility_id', 'name address');

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : (err as Error).message
    });
  }
};

// @desc    Get single appointment
// @route   GET /api/v1/appointments/:id
// @access  Private (Admin, Doctor, or Patient involved)
export const getAppointment = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient_id', 'full_name email phone_number')
      .populate('doctor_id', 'full_name email phone_number')
      .populate('facility_id', 'name address');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Make sure user is appointment owner (patient or doctor) or admin
    if (
      appointment.patient_id.toString() !== req.user?._id.toString() &&
      appointment.doctor_id.toString() !== req.user?._id.toString() &&
      req.user?.role !== 'Admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this appointment'
      });
    }

    return res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : (err as Error).message
    });
  }
};

// @desc    Get appointments for logged in user (patient or doctor)
// @route   GET /api/v1/appointments/me
// @access  Private
export const getMyAppointments = async (req: Request, res: Response) => {
  try {
    let query = {};

    if (req.user?.role === 'Patient') {
      query = { patient_id: req.user._id };
    } else if (req.user?.role === 'Doctor') {
      query = { doctor_id: req.user._id };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user role for this operation'
      });
    }

    const appointments = await Appointment.find(query);

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : (err as Error).message
    });
  }
};

// @desc    Create new appointment
// @route   POST /api/v1/appointments
// @access  Private
export const createAppointment = async (
  req: Request<{}, {}, CreateAppointmentRequestBody>,
  res: Response
) => {
  try {
    // If user is a patient, set patient_id to their ID
    if (req.user?.role === 'Patient') {
      req.body.patient_id = req.user._id;
    }

    // Check if doctor exists
    const doctor = await User.findById(req.body.doctor_id);
    if (!doctor || doctor.role !== 'Doctor') {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check if facility exists
    const facility = await Facility.findById(req.body.facility_id);
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    // Create appointment
    const appointment = await Appointment.create(req.body);

    return res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : (err as Error).message
    });
  }
};

// @desc    Update appointment
// @route   PUT /api/v1/appointments/:id
// @access  Private (Admin, Doctor, or Patient involved)
export const updateAppointment = async (
  req: Request<{ id: string }, {}, UpdateAppointmentRequestBody>,
  res: Response
) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Make sure user is appointment owner (patient or doctor) or admin
    if (
      appointment.patient_id.toString() !== req.user?._id.toString() &&
      appointment.doctor_id.toString() !== req.user?._id.toString() &&
      req.user?.role !== 'Admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }

    // If user is patient, they can only update status to 'Cancelled'
    if (
      req.user?.role === 'Patient' && 
      req.body.status && 
      req.body.status !== 'Cancelled'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Patients can only cancel appointments'
      });
    }

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    return res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : (err as Error).message
    });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/v1/appointments/:id
// @access  Private/Admin
export const deleteAppointment = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    await appointment.deleteOne();

    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : (err as Error).message
    });
  }
};

// @desc    Get appointments that need reminders
// @route   GET /api/v1/appointments/reminders
// @access  Private/Admin
export const getAppointmentsNeedingReminders = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find({
      appointment_time: { 
        $gt: new Date(), 
        $lt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      },
      status: 'Confirmed',
      reminder_sent: false
    });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : (err as Error).message
    });
  }
};

// @desc    Mark appointment reminder as sent
// @route   PUT /api/v1/appointments/:id/reminder-sent
// @access  Private/Admin
export const markReminderSent = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { reminder_sent: true },
      {
        new: true,
        runValidators: true
      }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : (err as Error).message
    });
  }
};

// Type for appointment filter query parameters
interface AppointmentFilterQuery {
  status?: AppointmentStatus;
  start_date?: string;
  end_date?: string;
  patient_id?: string;
  doctor_id?: string;
  facility_id?: string;
}

// @desc    Get appointments with filters
// @route   GET /api/v1/appointments/filter
// @access  Private/Admin
export const getAppointmentsByFilter = async (
  req: Request<{}, {}, {}, AppointmentFilterQuery>,
  res: Response
) => {
  try {
    const { status, start_date, end_date, patient_id, doctor_id, facility_id } = req.query;

    // Build query object
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (start_date || end_date) {
      query.appointment_time = {};

      if (start_date) {
        query.appointment_time.$gte = new Date(start_date);
      }

      if (end_date) {
        query.appointment_time.$lte = new Date(end_date);
      }
    }

    if (patient_id) {
      query.patient_id = patient_id;
    }

    if (doctor_id) {
      query.doctor_id = doctor_id;
    }

    if (facility_id) {
      query.facility_id = facility_id;
    }

    const appointments = await Appointment.find(query)
      .sort({ appointment_time: 1 })
      .populate('patient_id', 'full_name email phone_number')
      .populate('doctor_id', 'full_name email phone_number')
      .populate('facility_id', 'name address');

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : (err as Error).message
    });
  }
};

// @desc    Get appointment statistics for admin dashboard
// @route   GET /api/v1/appointments/stats
// @access  Private/Admin
export const getAppointmentStats = async (
  req: Request,
  res: Response
) => {
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get date for tomorrow at midnight
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get date for next 7 days
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // Get total appointments
    const totalAppointments = await Appointment.countDocuments();

    // Get appointments by status
    const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });
    const confirmedAppointments = await Appointment.countDocuments({ status: 'Confirmed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'Cancelled' });
    const completedAppointments = await Appointment.countDocuments({ status: 'Completed' });

    // Get today's appointments
    const todayAppointments = await Appointment.countDocuments({
      appointment_time: { $gte: today, $lt: tomorrow }
    });

    // Get upcoming appointments for the next 7 days
    const upcomingAppointments = await Appointment.countDocuments({
      appointment_time: { $gte: today, $lt: nextWeek },
      status: { $in: ['Pending', 'Confirmed'] }
    });

    // Get appointments that need attention (pending and within the next 24 hours)
    const nextDay = new Date(today);
    nextDay.setDate(nextDay.getDate() + 1);
    const needAttentionAppointments = await Appointment.countDocuments({
      status: 'Pending',
      appointment_time: { $gte: today, $lt: nextDay }
    });

    return res.status(200).json({
      success: true,
      data: {
        total: totalAppointments,
        byStatus: {
          pending: pendingAppointments,
          confirmed: confirmedAppointments,
          cancelled: cancelledAppointments,
          completed: completedAppointments
        },
        today: todayAppointments,
        upcoming: upcomingAppointments,
        needAttention: needAttentionAppointments
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : (err as Error).message
    });
  }
};
