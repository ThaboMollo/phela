import mongoose, { Document, Schema, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Type for appointment status
export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';

// Interface to define the Appointment document properties
export interface IAppointment extends Document {
  _id: string;
  patient_id: string;
  doctor_id: string;
  facility_id: string;
  status: AppointmentStatus;
  appointment_time: Date;
  reason: string;
  notes?: string;
  reminder_sent: boolean;
  created_at: Date;
  updated_at: Date;
  isUpcoming: boolean; // Virtual property
  needsReminder: boolean; // Virtual property
}

// Interface for the Appointment model with static methods
interface IAppointmentModel extends Model<IAppointment> {
  // Add static methods here if needed
}

const AppointmentSchema: Schema = new Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  patient_id: {
    type: String,
    ref: 'User',
    required: true
  },
  doctor_id: {
    type: String,
    ref: 'User',
    required: true
  },
  facility_id: {
    type: String,
    ref: 'Facility',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
    default: 'Pending'
  },
  appointment_time: {
    type: Date,
    required: [true, 'Please add appointment time']
  },
  reason: {
    type: String,
    required: [true, 'Please provide a reason for the appointment']
  },
  notes: {
    type: String
  },
  reminder_sent: {
    type: Boolean,
    default: false
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
AppointmentSchema.pre<IAppointment>('findOneAndUpdate', function() {
  this.set({ updated_at: new Date() });
});

// Virtual for checking if appointment is upcoming
AppointmentSchema.virtual('isUpcoming').get(function(this: IAppointment): boolean {
  return this.appointment_time > new Date() && this.status !== 'Cancelled';
});

// Virtual for checking if appointment needs a reminder
AppointmentSchema.virtual('needsReminder').get(function(this: IAppointment): boolean {
  const reminderThreshold = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const timeUntilAppointment = this.appointment_time.getTime() - new Date().getTime();
  return !this.reminder_sent && 
         timeUntilAppointment > 0 && 
         timeUntilAppointment <= reminderThreshold && 
         this.status === 'Confirmed';
});

// Set toJSON option to include virtuals
AppointmentSchema.set('toJSON', { virtuals: true });
AppointmentSchema.set('toObject', { virtuals: true });

export default mongoose.model<IAppointment, IAppointmentModel>('Appointment', AppointmentSchema);