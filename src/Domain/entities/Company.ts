import mongoose from 'mongoose';
import { CustomError } from '../../shared/error/customError';
import { STATUS_CODES } from '../../shared/constants/statusCodes';

export interface imageObject {
  url: string;
  publicId: string;
}

export interface Member {
  userId: mongoose.Types.ObjectId | string;
  role: 'companyMember' | 'companyAdmin';
  _id?: mongoose.Types.ObjectId | string;
}
export class Company {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  establishedDate: Date;
  industry: string;
  verificationDocument?: imageObject;
  documentNumber?: string;
  entity: 'company' | 'user';
  password: string;
  _id: string | mongoose.Types.ObjectId;
  companyLogo?: imageObject;
  appPlan: 'basic' | 'premium';
  isBlocked: boolean;
  isPremium: boolean;
  isVerified: boolean;
  isDeleted: boolean;
  isSpam: boolean;
  members: Member[];
  createdAt: Date;
  updatedAt: Date;
  // admins :  mongoose.Types.ObjectId[];

  constructor(data: Partial<Company>) {
    this._id = data._id || new mongoose.Types.ObjectId().toString();
    this.companyName = data.companyName!;
    // this.admins = data.admins  || [];
    this.email = data.email!;
    this.phone = data.phone!;
    this.website = data.website || '';
    this.industry = data.industry!;
    this.documentNumber = data.documentNumber || '';
    this.verificationDocument = data.verificationDocument || {
      url: '',
      publicId: '',
    };
    this.address = data.address!;
    this.establishedDate = data.establishedDate!;
    this.password = data.password!;
    this.entity = data.entity || 'company';
    this.companyLogo = data.companyLogo || { url: '', publicId: '' };
    this.appPlan = data.appPlan || 'basic';
    this.isBlocked = data.isBlocked || false;
    this.isPremium = data.isPremium || false;
    this.isVerified = data.isVerified || false;
    this.isDeleted = data.isDeleted || false;
    this.isSpam = data.isSpam || false;
    this.members = data.members || [];
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

  upgradeToPremium(): void {
    this.isPremium = true;
    this.appPlan = 'premium';
  }

  blockUser(): void {
    this.isBlocked = true;
  }
}

export const normalizeCompany = (data: any): Company => {
  // console.log('Received company data:', data);
  if (!data || !data._id) {
    throw new CustomError(
      STATUS_CODES.BAD_REQUEST,
      'Invalid data or missing _id'
    );
  }

  return {
    ...data,
    _id: data._id.toString(),
  };
};
