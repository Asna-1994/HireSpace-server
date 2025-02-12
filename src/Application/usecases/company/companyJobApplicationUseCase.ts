import { JobSeekerProfileRepository } from "../../../Domain/repository/repo/JobSeekerProfileRepo";
import { JobApplicationRepository } from "../../../Domain/repository/repo/jobApplicationRepository";
import { CustomError } from "../../../shared/error/customError";
import { STATUS_CODES } from "../../../shared/constants/statusCodes";
import { JobApplication } from "../../../Domain/entities/JobApplication";

export class CompanyJobApplicationUseCase {
  constructor(private jobApplicationRepository: JobApplicationRepository) {}

  async getAllApplicationForCompany({
    companyId,
    page = 1,
    limit = 10,
    searchTerm = "",
    status = "",
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
        { "userId.userName": { $regex: searchTerm, $options: "i" } },
        { "userId.email": { $regex: searchTerm, $options: "i" } },
        { "jobPostId.jobTitle": { $regex: searchTerm, $options: "i" } },
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
          filter,
        );

      const totalPages = Math.ceil(totalApplications / limit);

      return {
        jobApplications,
        totalApplications,
        totalPages,
        currentPage: page,
      };
    } catch (err) {
      console.error("Error while fetching applications:", err);
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        "Error while getting applications",
      );
    }
  }

  //update status of application

  async updateStatus(
    applicationId: string,
    status: "pending" | "reviewed" | "accepted" | "rejected",
  ) {
    try {
      const application =
        await this.jobApplicationRepository.findById(applicationId);
      if (!application) {
        throw new CustomError(
          STATUS_CODES.NOT_FOUND,
          "No application found with this ID",
        );
      }

      if (!application._id || !application.userId || !application.jobPostId) {
        throw new CustomError(
          STATUS_CODES.INTERNAL_SERVER_ERROR,
          "Application data is incomplete.",
        );
      }

      application.status = status;
      const updatedApplication =
        await this.jobApplicationRepository.update(application);
      return updatedApplication;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        "Error while updating status",
      );
    }
  }
}
