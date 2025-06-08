import { Request, Response } from 'express';

import Facility, { IFacility } from '../models/Facility';

// Type for facility creation request body
interface CreateFacilityRequestBody {
  name: string;
  location: {
    type: string;
    coordinates: number[];
    address: string;
  };
  facility_type: 'Clinic' | 'Hospital' | 'GP' | 'Specialist' | 'Other';
  services?: string[];
  operating_hours?: string;
  contact_number?: string;
}

// Type for facility update request body (all fields optional)
interface UpdateFacilityRequestBody {
  name?: string;
  location?: {
    type?: string;
    coordinates?: number[];
    address?: string;
  };
  facility_type?: 'Clinic' | 'Hospital' | 'GP' | 'Specialist' | 'Other';
  services?: string[];
  operating_hours?: string;
  contact_number?: string;
}

// @desc    Get all facilities
// @route   GET /api/v1/facilities
// @access  Public
export const getFacilities = async (req: Request, res: Response): Promise<void> => {
  try {
    const facilities = await Facility.find();

    res.status(200).json({
      success: true,
      count: facilities.length,
      data: facilities
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

// @desc    Get single facility
// @route   GET /api/v1/facilities/:id
// @access  Public
export const getFacility = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const facility = await Facility.findById(req.params.id);

    if (!facility) {
      res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: facility
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

// @desc    Create new facility
// @route   POST /api/v1/facilities
// @access  Private/Admin
export const createFacility = async (
  req: Request<{}, {}, CreateFacilityRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const facility = await Facility.create(req.body);

    res.status(201).json({
      success: true,
      data: facility
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

// @desc    Update facility
// @route   PUT /api/v1/facilities/:id
// @access  Private/Admin
export const updateFacility = async (
  req: Request<{ id: string }, {}, UpdateFacilityRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const facility = await Facility.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!facility) {
      res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: facility
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

// @desc    Delete facility
// @route   DELETE /api/v1/facilities/:id
// @access  Private/Admin
export const deleteFacility = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const facility = await Facility.findById(req.params.id);

    if (!facility) {
      res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
      return;
    }

    await facility.deleteOne();

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

// @desc    Get facilities within a radius
// @route   GET /api/v1/facilities/radius/:latitude/:longitude/:distance
// @access  Public
export const getFacilitiesInRadius = async (
  req: Request<{ latitude: string; longitude: string; distance: string }>,
  res: Response
): Promise<void> => {
  try {
    const { latitude, longitude, distance } = req.params;

    // Convert distance to number
    const radius = parseFloat(distance);

    if (isNaN(radius)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid distance in kilometers'
      });
      return;
    }

    const facilities = await Facility.getFacilitiesInRadius(
      parseFloat(longitude),
      parseFloat(latitude),
      radius
    );

    res.status(200).json({
      success: true,
      count: facilities.length,
      data: facilities
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
