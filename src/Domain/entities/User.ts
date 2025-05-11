import mongoose, { ObjectId } from 'mongoose';
interface imageObject {
  url: string;
  publicId: string;
}

export class User {
  userName?: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  tagLine?: string;
  entity: 'company' | 'user';
  userRole?: 'jobSeeker' | 'companyAdmin' | 'companyMember' | 'admin';
  password?: string;
  _id: string;
  profilePhoto?: imageObject;
  googleId?: string;
  refreshTokens  : string[];
  appPlan: {
    planType: string;
    startDate: Date | null;
    endDate: Date | null;
    subscriptionId: mongoose.Types.ObjectId | null;
  };
  isBlocked: boolean;
  isPremium: boolean;
  isVerified: boolean;
  isDeleted: boolean;
  isFresher: boolean;
  isSpam: boolean;
  companyId?: mongoose.Types.ObjectId;
  connections: mongoose.Types.ObjectId[];
  savedJobs: mongoose.Types.ObjectId[];
  appliedJobs: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<User>) {
    this._id = data._id!;
    this.userName = data.userName!;
    this.email = data.email!;
    this.phone = data.phone;
    this.tagLine = data.tagLine;
    this.address = data.address;
    this.refreshTokens = data.refreshTokens!;
    this.dateOfBirth = data.dateOfBirth;
    this.userRole = data.userRole || 'jobSeeker';
    this.password = data.password;
    this.entity = data.entity || 'user';
    this.profilePhoto = data.profilePhoto || { url: '', publicId: '' };
    this.googleId = data.googleId;
    this.appPlan = data.appPlan || {
      planType: 'basic',
      startDate: null,
      endDate: null,
      subscriptionId: null,
    };
    this.isBlocked = data.isBlocked || false;
    this.isPremium = data.isPremium || false;
    this.isVerified = data.isVerified || false;
    this.isDeleted = data.isDeleted || false;
    this.isFresher = data.isFresher || true;
    this.isSpam = data.isSpam || false;
    this.companyId = data.companyId;
    this.connections = data.connections || [];
    this.savedJobs = data.savedJobs || [];
    this.appliedJobs = data.appliedJobs || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  validateEmail(): void {
    if (!this.email.includes('@')) {
      throw new Error('Invalid email address');
    }
  }

  markAsVerified(): void {
    this.isVerified = true;
  }



  blockUser(): void {
    this.isBlocked = true;
  }

  addConnection(connectionId: mongoose.Types.ObjectId): void {
    if (!this.connections.includes(connectionId)) {
      this.connections.push(connectionId);
    }
  }
}
export function hydrateCompany(doc: mongoose.Document): User {
  return new User(doc.toObject());
}
