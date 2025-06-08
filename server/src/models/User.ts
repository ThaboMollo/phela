import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose, { Document, Schema, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Define the user roles as a type
export type UserRole = 'Patient' | 'Doctor' | 'Admin';

// Interface to define the User document properties
export interface IUser extends Document {
  _id: string;
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
  getSignedJwtToken(): string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// Interface for the User model with static methods
interface IUserModel extends Model<IUser> {
  // Add static methods here if needed
}

const UserSchema: Schema = new Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  full_name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone_number: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['Patient', 'Doctor', 'Admin'],
    default: 'Patient'
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

// Encrypt password using bcrypt
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.updated_at = new Date();
});

// Update the updated_at field on update
UserSchema.pre('findOneAndUpdate', function() {
  this.set({ updated_at: new Date() });
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function(): string {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRE;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  if (!expiresIn) {
    throw new Error('JWT_EXPIRE is not defined in environment variables');
  }
  return jwt.sign({ id: this._id }, secret, {
    expiresIn: '1h'
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser, IUserModel>('User', UserSchema);
