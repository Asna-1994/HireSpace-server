import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { IJobApplicationRepository } from '../../../Domain2/respositories/IJobApplicationRepo';
import { denormalizeJobApplication } from '../../../shared/utils/Normalisation/normaliseJobApplicaiton';




export class CompanyJobApplicationUseCase {
  constructor(private jobApplicationRepository: IJobApplicationRepository) {}

  async getAllApplicationForCompany({
    companyId,
    page = 1,
    limit = 10,
    searchTerm = '',
    status = '',
    jobPostId,
  }: {
    companyId: string;
    page?: number;
    limit?: number;
    searchTerm?: string;
    status?: string;
    jobPostId?: string;
  }) {
    const offset = (page - 1) * limit;
    const filter: any = {
      companyId,
      isDeleted: false,
    };

    // Apply search filters if a search term is provided
    if (searchTerm) {
      filter.$or = [
        { 'userId.userName': { $regex: searchTerm, $options: 'i' } },
        { 'userId.email': { $regex: searchTerm, $options: 'i' } },
        { 'jobPostId.jobTitle': { $regex: searchTerm, $options: 'i' } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (jobPostId) {
      filter.jobPostId = jobPostId;
    }

    try {
      const { jobApplications, totalApplications } =
        await this.jobApplicationRepository.findApplicationWithPagination(
          offset,
          limit,
          filter
        );

      const totalPages = Math.ceil(totalApplications / limit);

      return {
        jobApplications,
        totalApplications,
        totalPages,
        currentPage: page,
      };
    } catch (err) {
      console.error('Error while fetching applications:', err);
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error while getting applications'
      );
    }
  }

  //update status of application

  async updateStatus(
    applicationId: string,
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  ) {
    try {
     const updatedApplication = await this.jobApplicationRepository.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );
      if (!updatedApplication) {
        throw new CustomError(STATUS_CODES.NOT_FOUND,MESSAGES.APPLICATION_NOT_FOUND);
      }

      return updatedApplication;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error while updating status'
      );
    }
  }
}
