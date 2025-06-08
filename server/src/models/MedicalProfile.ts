import mongoose, { Document, Schema, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Interface to define the MedicalProfile document properties
export interface IMedicalProfile extends Document {
  _id: string;
  user_id: string;
  date_of_birth: Date;
  gender: 'Male' | 'Female' | 'Other';
  blood_type: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';
  allergies: string[];
  chronic_conditions: string[];
  created_at: Date;
  updated_at: Date;
}

// Interface for the MedicalProfile model with static methods
interface IMedicalProfileModel extends Model<IMedicalProfile> {
  // Add static methods here if needed
}

const MedicalProfileSchema: Schema = new Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  user_id: {
    type: String,
    ref: 'User',
    required: true
  },
  date_of_birth: {
    type: Date,
    required: [true, 'Please add date of birth']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Please specify gender']
  },
  blood_type: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    default: 'Unknown'
  },
  allergies: {
    type: [String],
    default: []
  },
  chronic_conditions: {
    type: [String],
    default: []
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

// Update the updated_at field on update
MedicalProfileSchema.pre<IMedicalProfile>('findOneAndUpdate', function() {
  this.set({ updated_at: new Date() });
});

export default mongoose.model<IMedicalProfile, IMedicalProfileModel>('MedicalProfile', MedicalProfileSchema);