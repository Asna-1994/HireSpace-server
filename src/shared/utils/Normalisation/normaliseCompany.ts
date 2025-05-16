import { ICompanyProfileDTO } from './../../../Application2/dto/Company/CompanyProfileDTO';
import mongoose from 'mongoose';
import { ICompanyDTO } from '../../../Application2/dto/Company/companyDTO';
import { ICompany } from '../../../Domain2/entities/Company';
import { ICompanyProfile } from '../../../Domain2/entities/CompanyProfile';
import { CustomError } from '../../error/customError';
import { STATUS_CODES } from '../../constants/statusCodes';


export const normalizeCompanyProfile = (data: any): ICompanyProfileDTO => {
  // console.log('Received company data:', data);

  if (!data || !data._id || !data.companyId) {
    throw new CustomError(
      STATUS_CODES.BAD_REQUEST,
      'Invalid data or missing _id/companyId'
    );
  }

  return {
    ...data,
    _id: data._id ? data._id.toString() : undefined,
    companyId: data.companyId.toString(),
  };
};

export const normalizeCompany = (data: any): ICompanyDTO=> {
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

export function denormalizeCompanyProfile(data: ICompanyProfileDTO): ICompanyProfile {

  // console.log('Received company data:', data);

  if (!data || !data._id || !data.companyId) {
    throw new CustomError(
      STATUS_CODES.BAD_REQUEST,
      'Invalid data or missing _id/companyId'
    );
  }

  return {
    ...data,
    _id:new mongoose.Types.ObjectId(data._id),
    companyId: new mongoose.Types.ObjectId(data.companyId)
  };

}

export function denormalizeCompany(dto: ICompanyDTO): ICompany{
  if (!dto || !dto._id) {
    throw new CustomError(
      STATUS_CODES.BAD_REQUEST,
      'Invalid DTO or missing _id'
    );
  }

  return {
    ...dto,
    _id: new mongoose.Types.ObjectId(dto._id),
  };
}
