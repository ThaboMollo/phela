import { Request, Response, RequestHandler } from 'express';

import Appointment from '../models/Appointment';
import Consultation from '../models/Consultation';

// Type for consultation creation request body
interface CreateConsultationRequestBody {
  appointment_id: string;
  notes: string;
  diagnosis: string;
  prescription_id?: string;
}

// Type for consultation update request body (all fields optional)
interface UpdateConsultationRequestBody {
  notes?: string;
  diagnosis?: string;
  prescription_id?: string;
}

// @desc    Get all consultations
// @route   GET /api/v1/consultations
// @access  Private/Admin
export const getConsultations: RequestHandler = async (req, res) => {
  try {
    const consultations = await Consultation.find();
    res.status(200).json({
      success: true,
      count: consultations.length,
      data: consultations
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : (err as Error).message
    });
  }
};

// @desc    Get single consultation
// @route   GET /api/v1/consultations/:id
// @access  Private (Admin, Doctor, or Patient involved)
export const getConsultation: RequestHandler = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      res.status(404).json({
        success: false,
        message: 'Consultation not found',
      });
      return;
    }
    const appointment = await Appointment.findById(consultation.appointment_id);
    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Associated appointment not found',
      });
      return;
    }
    const userId = req.user?._id?.toString();
    const isAdmin = req.user?.role === 'Admin';
    const isDoctor = appointment.doctor_id.toString() === userId;
    const isPatient = appointment.patient_id.toString() === userId;
    if (!isAdmin && !isDoctor && !isPatient) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to access this consultation',
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: consultation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : (err as Error).message,
    });
  }
};


// @desc    Get consultations for logged in user (patient or doctor)
// @route   GET /api/v1/consultations/me
// @access  Private
export const getMyConsultations: RequestHandler = async (req, res) => {
  try {
    let appointmentQuery = {};
    if (req.user?.role === 'Patient') {
      appointmentQuery = { patient_id: req.user._id };
    } else if (req.user?.role === 'Doctor') {
      appointmentQuery = { doctor_id: req.user._id };
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user role for this operation'
      });
      return;
    }
    const appointments = await Appointment.find(appointmentQuery);
    const appointmentIds = appointments.map(app => app._id);
    const consultations = await Consultation.find({
      appointment_id: { $in: appointmentIds }
    });
    res.status(200).json({
      success: true,
      count: consultations.length,
      data: consultations
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : (err as Error).message
    });
  }
};

// @desc    Create new consultation
// @route   POST /api/v1/consultations
// @access  Private/Doctor
export const createConsultation: RequestHandler = async (
  req: Request<{}, {}, CreateConsultationRequestBody>,
  res: Response
) => {
  try {
    // Only doctors can create consultations
    if (req.user?.role !== 'Doctor') {
      res.status(403).json({
        success: false,
        message: 'Only doctors can create consultations'
      });
      return;
    }

    // Check if appointment exists
    const appointment = await Appointment.findById(req.body.appointment_id);
    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
      return;
    }

    // Check if doctor is assigned to this appointment
    if (appointment.doctor_id.toString() !== req.user._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'You are not the doctor assigned to this appointment'
      });
      return;
    }

    // Check if appointment is in the right status
    if (appointment.status !== 'Confirmed') {
      res.status(400).json({
        success: false,
        message: 'Consultation can only be created for confirmed appointments'
      });
      return;
    }

    // Check if consultation already exists for this appointment
    const existingConsultation = await Consultation.findOne({ 
      appointment_id: req.body.appointment_id 
    });
    if (existingConsultation) {
      res.status(400).json({
        success: false,
        message: 'Consultation already exists for this appointment'
      });
      return;
    }

    // Create consultation
    const consultation = await Consultation.create(req.body);
    res.status(201).json({
      success: true,
      data: consultation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : (err as Error).message
    });
  }
};

// @desc    Update consultation
// @route   PUT /api/v1/consultations/:id
// @access  Private/Doctor
export const updateConsultation: RequestHandler<{ id: string }, any, UpdateConsultationRequestBody> = async (req, res) => {
  try {
    let consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
      return;
    }

    // Get the appointment to check permissions
    const appointment = await Appointment.findById(consultation.appointment_id);
    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Associated appointment not found'
      });
      return;
    }

    // Only the doctor who created the consultation or admin can update it
    if (
      appointment.doctor_id.toString() !== req.user?._id.toString() &&
      req.user?.role !== 'Admin'
    ) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this consultation'
      });
      return;
    }

    consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    res.status(200).json({
      success: true,
      data: consultation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : (err as Error).message
    });
  }
};

// @desc    Delete consultation
// @route   DELETE /api/v1/consultations/:id
// @access  Private/Admin
export const deleteConsultation: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
      return;
    }
    await consultation.deleteOne();
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : (err as Error).message
    });
  }
};
