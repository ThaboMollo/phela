import mongoose, { Document, Schema, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Interface to define the Consultation document properties
export interface IConsultation extends Document {
  _id: string;
  appointment_id: string;
  notes: string;
  diagnosis: string;
  prescription_id: string | null;
  created_at: Date;
  updated_at: Date;
}

// Interface for the Consultation model with static methods
interface IConsultationModel extends Model<IConsultation> {
  // Add static methods here if needed
}

const ConsultationSchema: Schema = new Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  appointment_id: {
    type: String,
    ref: 'Appointment',
    required: true
  },
  notes: {
    type: String,
    required: [true, 'Please add consultation notes']
  },
  diagnosis: {
    type: String,
    required: [true, 'Please add diagnosis']
  },
  prescription_id: {
    type: String,
    ref: 'Prescription',
    default: null
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
ConsultationSchema.pre<IConsultation>('findOneAndUpdate', function() {
  this.set({ updated_at: new Date() });
});

// Update appointment status to completed when consultation is created
ConsultationSchema.post<IConsultation>('save', async function() {
  const Appointment = mongoose.model('Appointment');
  await Appointment.findByIdAndUpdate(this.appointment_id, {
    status: 'Completed'
  });
});

export default mongoose.model<IConsultation, IConsultationModel>('Consultation', ConsultationSchema);