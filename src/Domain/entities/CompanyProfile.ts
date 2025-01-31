import mongoose from 'mongoose';
import { CustomError } from "../../shared/error/customError";
import { STATUS_CODES } from "../../shared/constants/statusCodes";

export class CompanyProfile {
  companyId: mongoose.Types.ObjectId;
  _id: mongoose.Types.ObjectId;
  mission?: string;
  vision?: string;
  founder?: string;
  ceo?: string;
  description?: string;
  aboutUs?: string;
  website?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  } = {};
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<CompanyProfile>) {
    if (!data.companyId) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, 'Company ID is required');
    }

    this._id = data._id!
    this.companyId = new mongoose.Types.ObjectId(data.companyId);
    this.mission = data.mission;
    this.vision = data.vision;
    this.founder = data.founder;
    this.ceo = data.ceo;
    this.description = data.description;
    this.aboutUs = data.aboutUs;
    this.website = data.website;
    this.socialLinks = {
      facebook: data.socialLinks?.facebook,
      instagram: data.socialLinks?.instagram,
      twitter: data.socialLinks?.twitter,
      linkedin: data.socialLinks?.linkedin,
    };
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export const normalizeCompanyProfile = (data: any): CompanyProfile => {
  // console.log('Received company data:', data);

  if (!data || !data._id || !data.companyId) {
    throw new CustomError(STATUS_CODES.BAD_REQUEST, 'Invalid data or missing _id/companyId');
  }

  return new CompanyProfile({
    ...data,
    _id: data._id ? new mongoose.Types.ObjectId(data._id) : undefined,
    companyId: new mongoose.Types.ObjectId(data.companyId),
  });
};
