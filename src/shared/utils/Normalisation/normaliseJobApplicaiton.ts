
import { IJobApplicationDTO } from './../../../Application2/dto/JobApplication/JobApplicationDTO';
import mongoose from 'mongoose';
import { IJobApplication } from '../../../Domain2/entities/JobApplication'; // Adjust path as needed
import { CustomError } from '../../error/customError';
import { STATUS_CODES } from '../../constants/statusCodes';


export const normalizeJobApplication = (data: any): IJobApplicationDTO => {
  try {
    if (!data || !data._id || !data.userId || !data.jobPostId || !data.jobPostId.companyId) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
        'Invalid job application data: missing required fields.'
      );
    }

    return {
      _id: data._id.toString(),
      userId: {
        _id: data.userId._id?.toString(),
        userName: data.userId.userName,
        email: data.userId.email,
        phone: data.userId.phone,
        address: data.userId.address,
        profilePhoto: data.userId.profilePhoto?.url || '', // adjust if nested
      },
      jobPostId: {
        postedBy : data.postedBy,
        _id: data.jobPostId._id.toString(),
        jobTitle: data.jobPostId.jobTitle,
        description: data.jobPostId.description,
        salaryRange: {
          min: data.jobPostId.salaryRange.min,
          max: data.jobPostId.salaryRange.max,
          currency : data.jobPostId.salaryRange.currency      
        },
        location: {
          city: data.jobPostId.location.city,
          state: data.jobPostId.location.state,
          country: data.jobPostId.location.country,
          remote : data.jobPostId.location.remote
        },
        skillsRequired: data.jobPostId.skillsRequired,
        responsibilities: data.jobPostId.responsibilities,
        jobType: data.jobPostId.jobType,
        workMode: data.jobPostId.workMode,
        experienceLevel: data.jobPostId.experienceLevel,
        educationRequired: data.jobPostId.educationRequired,
        applicationDeadline: data.jobPostId.applicationDeadline,
        employmentStartDate: data.jobPostId.employmentStartDate,
        numberOfVacancies: data.jobPostId.numberOfVacancies,
        benefits: data.jobPostId.benefits,
        status: data.jobPostId.status,
        isDeleted: data.jobPostId.isDeleted,
        isBlocked: data.jobPostId.isBlocked,
        createdAt: data.jobPostId.createdAt,
        updatedAt: data.jobPostId.updatedAt,
        companyId: {
          _id: data.jobPostId.companyId._id.toString(),
          companyName: data.jobPostId.companyId.companyName,
          email: data.jobPostId.companyId.email,
          phone: data.jobPostId.companyId.phone,
          address: data.jobPostId.companyId.address,
          industry: data.jobPostId.companyId.industry,
          companyLogo: data.jobPostId.companyId.companyLogo,
        },
      },
      companyId: data.companyId.toString(),
      coverLetter: {
        salutation: data.coverLetter?.salutation,
        body: data.coverLetter?.body,
        closing: data.coverLetter?.closing,
      },
      resumeUrl: data.resumeUrl,
      status: data.status,
      appliedDate: data.appliedDate,
      updatedDate: data.updatedDate,
      isDeleted: data.isDeleted,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  } catch (err) {
        console.error("Error normalizing Jobappllications:", err);
    throw new Error("Normalization failed");
  }
};



export function denormalizeJobApplication(data: IJobApplicationDTO): IJobApplication {
  try {
    return {
      _id: new mongoose.Types.ObjectId(data._id),
      userId: new mongoose.Types.ObjectId(data.userId._id),
      jobPostId: new mongoose.Types.ObjectId(data.jobPostId._id),
      companyId: new mongoose.Types.ObjectId(data.companyId),
      coverLetter: {
        salutation: data.coverLetter.salutation,
        body: data.coverLetter.body,
        closing: data.coverLetter.closing,
      },
      resumeUrl: data.resumeUrl,
      status: data.status,
      appliedDate: data.appliedDate,
      updatedDate: data.updatedDate,
      isDeleted: data.isDeleted,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  } catch (err) {
    throw new CustomError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to denormalize job application'
    );
  }
}
