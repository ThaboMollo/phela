import { Request, Response } from 'express';

import MedicalProfile from '../models/MedicalProfile';
import User, { IUser, UserRole } from '../models/User';

// Type for register request body
interface RegisterRequestBody {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  role?: UserRole;
  date_of_birth?: Date;
  gender?: 'Male' | 'Female' | 'Other';
}

// Type for login request body
interface LoginRequestBody {
  email: string;
  password: string;
}

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (
    req: Request<{}, {}, RegisterRequestBody>,
    res: Response
): Promise<void> => {
  try {
    const { full_name, email, phone_number, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
      return;
    }

    const user = await User.create({
      full_name,
      email,
      phone_number,
      password,
      role: role || 'Patient'
    });

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

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : (err as Error).message
    });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (
    req: Request<{}, {}, LoginRequestBody>,
    res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
      return;
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid Password'
      });
      return;
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? null : (err as Error).message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);

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

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user: IUser, statusCode: number, res: Response): void => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
        Date.now() + (process.env.JWT_COOKIE_EXPIRE ? parseInt(process.env.JWT_COOKIE_EXPIRE) : 30) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res
      .status(statusCode)
      .cookie('token', token, options)
      .json({
        success: true,
        token
      });
};
