import { IUser } from '../models/User';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// This empty export is needed to make TypeScript treat this file as a module
export {};
