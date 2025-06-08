import { Request, Response } from 'express';

import Consultation from '../models/Consultation';
import Prescription, { IPrescription } from '../models/Prescription';
import User from '../models/User';

// Type for prescription request body
interface PrescriptionRequestBody {
  patient_id: string;
  medication: string;
  dosage: string;
  instructions: string;
  start_date?: Date;
  end_date?: Date;
  refills?: number;
  consultation_id?: string;
  doctor_id?: string;
}

// Type for prescription update request body (all fields optional)
interface PrescriptionUpdateRequestBody {
  medication?: string;
  dosage?: string;
  instructions?: string;
  start_date?: Date;
  end_date?: Date;
  refills?: number;
}

// @desc    Get all prescriptions
// @route   GET /api/v1/prescriptions
// @access  Private/Admin
export const getPrescriptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const prescriptions = await Prescription.find();

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
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

// @desc    Get single prescription
// @route   GET /api/v1/prescriptions/:id
// @access  Private (Admin, Doctor, or Patient involved)
export const getPrescription = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
      return;
    }

    // Make sure user is prescription owner (patient or doctor) or admin
    if (
      prescription.patient_id.toString() !== req.user?._id.toString() &&
      prescription.doctor_id.toString() !== req.user?._id.toString() &&
      req.user?.role !== 'Admin'
    ) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to access this prescription'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: prescription
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

// @desc    Get prescriptions for logged in user (patient or doctor)
// @route   GET /api/v1/prescriptions/me
// @access  Private
export const getMyPrescriptions = async (req: Request, res: Response): Promise<void> => {
  try {
    let query = {};

    if (req.user?.role === 'Patient') {
      query = { patient_id: req.user._id };
    } else if (req.user?.role === 'Doctor') {
      query = { doctor_id: req.user._id };
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user role for this operation'
      });
      return;
    }

    const prescriptions = await Prescription.find(query);

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
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

// @desc    Create new prescription
// @route   POST /api/v1/prescriptions
// @access  Private/Doctor
export const createPrescription = async (
  req: Request<{}, {}, PrescriptionRequestBody>,
  res: Response
): Promise<void> => {
  try {
    // Only doctors can create prescriptions
    if (req.user?.role !== 'Doctor') {
      res.status(403).json({
        success: false,
        message: 'Only doctors can create prescriptions'
      });
      return;
    }

    // Set doctor_id to the logged in doctor
    req.body.doctor_id = req.user._id;

    // Check if patient exists
    const patient = await User.findById(req.body.patient_id);
    if (!patient || patient.role !== 'Patient') {
      res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
      return;
    }

    // Create prescription
    const prescription = await Prescription.create(req.body);

    // If consultation_id is provided, update the consultation with this prescription
    if (req.body.consultation_id) {
      const consultation = await Consultation.findById(req.body.consultation_id);
      if (consultation) {
        consultation.prescription_id = prescription._id;
        await consultation.save();
      }
    }

    res.status(201).json({
      success: true,
      data: prescription
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

// @desc    Update prescription
// @route   PUT /api/v1/prescriptions/:id
// @access  Private/Doctor
export const updatePrescription = async (
  req: Request<{ id: string }, {}, PrescriptionUpdateRequestBody>,
  res: Response
): Promise<void> => {
  try {
    let prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
      return;
    }

    // Only the doctor who created the prescription or admin can update it
    if (
      prescription.doctor_id.toString() !== req.user?._id.toString() &&
      req.user?.role !== 'Admin'
    ) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this prescription'
      });
      return;
    }

    prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: prescription
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

// @desc    Delete prescription
// @route   DELETE /api/v1/prescriptions/:id
// @access  Private/Admin
export const deletePrescription = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
      return;
    }

    // Check if this prescription is linked to any consultations
    const consultations = await Consultation.find({ prescription_id: req.params.id });

    // Remove the prescription reference from consultations
    for (const consultation of consultations) {
      consultation.prescription_id = null;
      await consultation.save();
    }

    await prescription.deleteOne();

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

// @desc    Get active prescriptions for a patient
// @route   GET /api/v1/prescriptions/active/:patientId
// @access  Private (Admin, Doctor, or Patient themselves)
export const getActivePrescriptions = async (
  req: Request<{ patientId: string }>,
  res: Response
): Promise<void> => {
  try {
    const patientId = req.params.patientId;

    // Check if user is authorized to view this patient's prescriptions
    if (
      patientId !== req.user?._id.toString() &&
      req.user?.role !== 'Admin' &&
      req.user?.role !== 'Doctor'
    ) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to access these prescriptions'
      });
      return;
    }

    // Get active prescriptions (end_date is null or in the future)
    const prescriptions = await Prescription.find({
      patient_id: patientId,
      $or: [
        { end_date: null },
        { end_date: { $gt: new Date() } }
      ]
    });

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
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
