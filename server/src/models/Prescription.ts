import mongoose, { Document, Schema, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Interface to define the Prescription document properties
export interface IPrescription extends Document {
  _id: string;
  doctor_id: string;
  patient_id: string;
  medication: string;
  dosage: string;
  instructions: string;
  start_date: Date;
  end_date?: Date;
  refills: number;
  created_at: Date;
  updated_at: Date;
  isActive: boolean; // Virtual property
}

// Interface for the Prescription model with static methods
interface IPrescriptionModel extends Model<IPrescription> {
  // Add static methods here if needed
}

const PrescriptionSchema: Schema = new Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  doctor_id: {
    type: String,
    ref: 'User',
    required: true
  },
  patient_id: {
    type: String,
    ref: 'User',
    required: true
  },
  medication: {
    type: String,
    required: [true, 'Please add medication name']
  },
  dosage: {
    type: String,
    required: [true, 'Please add dosage information']
  },
  instructions: {
    type: String,
    required: [true, 'Please add instructions']
  },
  start_date: {
    type: Date,
    default: Date.now
  },
  end_date: {
    type: Date
  },
  refills: {
    type: Number,
    default: 0
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
PrescriptionSchema.pre<IPrescription>('findOneAndUpdate', function() {
  this.set({ updated_at: new Date() });
});

// Virtual for checking if prescription is active
PrescriptionSchema.virtual('isActive').get(function(this: IPrescription): boolean {
  if (!this.end_date) return true;
  return this.end_date > new Date();
});

// Set toJSON option to include virtuals
PrescriptionSchema.set('toJSON', { virtuals: true });
PrescriptionSchema.set('toObject', { virtuals: true });

export default mongoose.model<IPrescription, IPrescriptionModel>('Prescription', PrescriptionSchema);