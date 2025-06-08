import { Request, Response } from 'express';

import MedicalProfile, { IMedicalProfile } from '../models/MedicalProfile';
import User from '../models/User';

// Type for medical profile creation request body
interface CreateMedicalProfileRequestBody {
  user_id: string;
  date_of_birth: Date;
  gender: 'Male' | 'Female' | 'Other';
  blood_type?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';
  allergies?: string[];
  chronic_conditions?: string[];
}

// Type for medical profile update request body (all fields optional)
interface UpdateMedicalProfileRequestBody {
  date_of_birth?: Date;
  gender?: 'Male' | 'Female' | 'Other';
  blood_type?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';
  allergies?: string[];
  chronic_conditions?: string[];
}

// @desc    Get all medical profiles
// @route   GET /api/v1/medical-profiles
// @access  Private/Admin
export const getMedicalProfiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const medicalProfiles = await MedicalProfile.find();

    res.status(200).json({
      success: true,
      count: medicalProfiles.length,
      data: medicalProfiles
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

// @desc    Get single medical profile
// @route   GET /api/v1/medical-profiles/:id
// @access  Private (Admin or Profile Owner)
export const getMedicalProfile = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const medicalProfile = await MedicalProfile.findById(req.params.id);

    if (!medicalProfile) {
      res.status(404).json({
        success: false,
        message: 'Medical profile not found'
      });
      return;
    }

    // Make sure user is profile owner or admin or doctor
    if (
      medicalProfile.user_id.toString() !== req.user?._id.toString() &&
      req.user?.role !== 'Admin' &&
      req.user?.role !== 'Doctor'
    ) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to access this medical profile'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: medicalProfile
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

// @desc    Get medical profile for logged in user
// @route   GET /api/v1/medical-profiles/me
// @access  Private
export const getMyMedicalProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const medicalProfile = await MedicalProfile.findOne({ user_id: req.user?._id });

    if (!medicalProfile) {
      res.status(404).json({
        success: false,
        message: 'Medical profile not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: medicalProfile
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

// @desc    Create medical profile
// @route   POST /api/v1/medical-profiles
// @access  Private/Admin
export const createMedicalProfile = async (
  req: Request<{}, {}, CreateMedicalProfileRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { user_id } = req.body;

    // Check if user exists
    const user = await User.findById(user_id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Check if medical profile already exists for this user
    const existingProfile = await MedicalProfile.findOne({ user_id });
    if (existingProfile) {
      res.status(400).json({
        success: false,
        message: 'Medical profile already exists for this user'
      });
      return;
    }

    const medicalProfile = await MedicalProfile.create(req.body);

    res.status(201).json({
      success: true,
      data: medicalProfile
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

// @desc    Update medical profile
// @route   PUT /api/v1/medical-profiles/:id
// @access  Private (Admin or Profile Owner)
export const updateMedicalProfile = async (
  req: Request<{ id: string }, {}, UpdateMedicalProfileRequestBody>,
  res: Response
): Promise<void> => {
  try {
    let medicalProfile = await MedicalProfile.findById(req.params.id);

    if (!medicalProfile) {
      res.status(404).json({
        success: false,
        message: 'Medical profile not found'
      });
      return;
    }

    // Make sure user is profile owner or admin
    if (
      medicalProfile.user_id.toString() !== req.user?._id.toString() &&
      req.user?.role !== 'Admin'
    ) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this medical profile'
      });
      return;
    }

    medicalProfile = await MedicalProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: medicalProfile
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

// @desc    Delete medical profile
// @route   DELETE /api/v1/medical-profiles/:id
// @access  Private/Admin
export const deleteMedicalProfile = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const medicalProfile = await MedicalProfile.findById(req.params.id);

    if (!medicalProfile) {
      res.status(404).json({
        success: false,
        message: 'Medical profile not found'
      });
      return;
    }

    await medicalProfile.deleteOne();

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
