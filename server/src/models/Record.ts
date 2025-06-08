import mongoose, { Document, Schema, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Type for file types
export type FileType = 'Lab Result' | 'Prescription' | 'Imaging' | 'Discharge Summary' | 'Other';

// Type for access levels
export type AccessLevel = 'Read' | 'ReadWrite';

// Interface for access permission
interface AccessPermission {
  user_id: string;
  access_level: AccessLevel;
  granted_at: Date;
}

// Interface to define the Record document properties
export interface IRecord extends Document {
  _id: string;
  user_id: string;
  file_url: string;
  file_type: FileType;
  title: string;
  description?: string;
  uploaded_at: Date;
  access_permissions: AccessPermission[];
  created_at: Date;
  updated_at: Date;
  hasAccess(userId: string): boolean;
  grantAccess(userId: string, accessLevel?: AccessLevel): boolean;
  revokeAccess(userId: string): boolean;
}

// Interface for the Record model with static methods
interface IRecordModel extends Model<IRecord> {
  // Add static methods here if needed
}

const RecordSchema: Schema = new Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  user_id: {
    type: String,
    ref: 'User',
    required: true
  },
  file_url: {
    type: String,
    required: [true, 'Please add file URL']
  },
  file_type: {
    type: String,
    enum: ['Lab Result', 'Prescription', 'Imaging', 'Discharge Summary', 'Other'],
    required: [true, 'Please specify file type']
  },
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  description: {
    type: String
  },
  uploaded_at: {
    type: Date,
    default: Date.now
  },
  access_permissions: {
    type: [{
      user_id: {
        type: String,
        ref: 'User'
      },
      access_level: {
        type: String,
        enum: ['Read', 'ReadWrite'],
        default: 'Read'
      },
      granted_at: {
        type: Date,
        default: Date.now
      }
    }],
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
RecordSchema.pre<IRecord>('findOneAndUpdate', function() {
  this.set({ updated_at: new Date() });
});

// Method to check if a user has access to this record
RecordSchema.methods.hasAccess = function(userId: string): boolean {
  // Record owner always has access
  if (this.user_id === userId) return true;
  
  // Check if user is in access_permissions
  return this.access_permissions.some(permission => permission.user_id === userId);
};

// Method to grant access to a user
RecordSchema.methods.grantAccess = function(userId: string, accessLevel: AccessLevel = 'Read'): boolean {
  // Don't add duplicate permissions
  if (this.access_permissions.some(permission => permission.user_id === userId)) {
    return false;
  }
  
  this.access_permissions.push({
    user_id: userId,
    access_level: accessLevel,
    granted_at: new Date()
  });
  
  return true;
};

// Method to revoke access from a user
RecordSchema.methods.revokeAccess = function(userId: string): boolean {
  const initialLength = this.access_permissions.length;
  this.access_permissions = this.access_permissions.filter(
    permission => permission.user_id !== userId
  );
  
  return initialLength !== this.access_permissions.length;
};

export default mongoose.model<IRecord, IRecordModel>('Record', RecordSchema);