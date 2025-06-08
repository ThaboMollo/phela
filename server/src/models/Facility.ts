import mongoose, { Document, Schema, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Interface for location coordinates
interface LocationCoordinates {
  type: string;
  coordinates: number[];
  address: string;
}

// Interface to define the Facility document properties
export interface IFacility extends Document {
  _id: string;
  name: string;
  location: LocationCoordinates;
  facility_type: 'Clinic' | 'Hospital' | 'GP' | 'Specialist' | 'Other';
  services: string[];
  operating_hours?: string;
  contact_number?: string;
  created_at: Date;
  updated_at: Date;
}

// Interface for the Facility model with static methods
interface IFacilityModel extends Model<IFacility> {
  getFacilitiesInRadius(longitude: number, latitude: number, radius: number): Promise<IFacility[]>;
}

const FacilitySchema: Schema = new Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  name: {
    type: String,
    required: [true, 'Please add a facility name'],
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    },
    address: {
      type: String,
      required: [true, 'Please add an address']
    }
  },
  facility_type: {
    type: String,
    enum: ['Clinic', 'Hospital', 'GP', 'Specialist', 'Other'],
    required: [true, 'Please specify facility type']
  },
  services: {
    type: [String],
    default: []
  },
  operating_hours: {
    type: String
  },
  contact_number: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Create 2dsphere index for geospatial queries
FacilitySchema.index({ location: '2dsphere' });

// Update the updated_at field on update
FacilitySchema.pre<IFacility>('findOneAndUpdate', function() {
  this.set({ updated_at: new Date() });
});

// Method to get facilities within a certain radius (in km)
FacilitySchema.statics.getFacilitiesInRadius = async function(
  longitude: number,
  latitude: number,
  radius: number
): Promise<IFacility[]> {
  return await this.find({
    location: {
      $geoWithin: {
        $centerSphere: [[longitude, latitude], radius / 6378.1]
      }
    }
  });
};

export default mongoose.model<IFacility, IFacilityModel>('Facility', FacilitySchema);