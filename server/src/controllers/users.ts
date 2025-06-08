import { Request, Response } from 'express';

import MedicalProfile from '../models/MedicalProfile';
import User, { IUser, UserRole } from '../models/User';

// Type for user creation request body
interface CreateUserRequestBody {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  role?: UserRole;
  date_of_birth?: Date;
  gender?: 'Male' | 'Female' | 'Other';
}

// Type for user update request body (all fields optional)
interface UpdateUserRequestBody {
  full_name?: string;
  email?: string;
  phone_number?: string;
  role?: UserRole;
}

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
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

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
export const getUser = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user
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

// @desc    Create user
// @route   POST /api/v1/users
// @access  Private/Admin
export const createUser = async (
  req: Request<{}, {}, CreateUserRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { full_name, email, phone_number, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
      return;
    }

    // Create user
    const user = await User.create({
      full_name,
      email,
      phone_number,
      password,
      role: role || 'Patient'
    });

    // If role is Patient, create an empty medical profile
    if (user.role === 'Patient') {
      await MedicalProfile.create({
        user_id: user._id,
        date_of_birth: req.body.date_of_birth || new Date('1900-01-01'),
        gender: req.body.gender || 'Other',
        blood_type: 'Unknown',
        allergies: [],
        chronic_conditions: []
      });
    }

    res.status(201).json({
      success: true,
      data: user
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

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
export const updateUser = async (
  req: Request<{ id: string }, {}, UpdateUserRequestBody>,
  res: Response
): Promise<void> => {
  try {
    // Remove password from update fields if it exists
    if ((req.body as any).password) {
      delete (req.body as any).password;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user
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

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Delete associated medical profile if user is a patient
    if (user.role === 'Patient') {
      await MedicalProfile.findOneAndDelete({ user_id: user._id });
    }

    await user.deleteOne();

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
