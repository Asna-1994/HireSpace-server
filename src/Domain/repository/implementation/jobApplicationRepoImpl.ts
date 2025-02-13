import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { CustomError } from '../../../shared/error/customError';
import { JobApplicationRepository } from '../repo/jobApplicationRepository';
import { JobApplicationModel } from '../../../Infrastructure/models/JobApplicationModel';
import {
  JobApplication,
  normalizeJobApplication,
} from '../../entities/JobApplication';

export class JobApplicationRepositoryImpl implements JobApplicationRepository {
  async findOne(filter: object): Promise<JobApplication | null> {
    const jobApplication = await JobApplicationModel.findOne(filter).lean();
    return jobApplication ? jobApplication : null;
  }

  async find(filter: object): Promise<JobApplication[] | []> {
    const jobApplications = await JobApplicationModel.find(filter)
      .populate('userId', 'userName email phone address profilePhoto')
      .populate({
        path: 'jobPostId',
        populate: {
          path: 'companyId',
          select: 'companyName email phone address industry companyLogo',
        },
      });
    return jobApplications as JobApplication[] | [];
  }

  async findApplicationWithPagination(
    offset: number,
    limit: number,
    filter: object
  ): Promise<{ jobApplications: JobApplication[]; totalApplications: number }> {
    try {
      const jobApplications = await JobApplicationModel.find(filter)
        .populate('userId', 'userName email phone address profilePhoto')
        .populate({
          path: 'jobPostId',
          populate: {
            path: 'companyId',
            select: 'companyName email phone address industry companyLogo',
          },
        })
        .skip(offset)
        .limit(limit);

      const totalApplications =
        await JobApplicationModel.countDocuments(filter);

      console.log('Job applications in repo', jobApplications);
      return {
        jobApplications: jobApplications as JobApplication[],
        totalApplications,
      };
    } catch (err) {
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Failed to return data from repository'
      );
    }
  }

  async findById(jobApplicationId: string): Promise<JobApplication | null> {
    const jobApplication =
      await JobApplicationModel.findById(jobApplicationId).lean();
    return jobApplication ? jobApplication : null;
  }

  async update(jobApplication: JobApplication): Promise<JobApplication> {
    const updatedApplication = await JobApplicationModel.findByIdAndUpdate(
      jobApplication._id,
      jobApplication,
      { new: true }
    )
      .lean()
      .exec();
    if (!updatedApplication) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, 'Failed to update');
    }
    return updatedApplication;
  }

  async findOneAndUpdate(
    filter: object,
    update: object,
    options: object
  ): Promise<JobApplication | null> {
    const jobApplication = await JobApplicationModel.findOneAndUpdate(
      filter,
      update,
      options
    ).lean();
    return jobApplication;
  }

  async findByIdAndUpdate(
    jobApplicationId: string,
    update: object,
    options: object
  ): Promise<JobApplication | null> {
    const jobApplication = await JobApplicationModel.findByIdAndUpdate(
      jobApplicationId,
      update,
      options
    ).lean();
    return jobApplication;
  }

  async create(
    jobApplication: Partial<JobApplication>
  ): Promise<JobApplication> {
    const newJobApplication = new JobApplicationModel(jobApplication);
    await newJobApplication.save();
    console.log('application creted in reposoroty', newJobApplication);
    return newJobApplication;
  }

  async count(filter: Record<string, any>): Promise<number> {
    try {
      return await JobApplicationModel.countDocuments(filter).exec();
    } catch (error) {
      console.error(
        'Error counting documents in jobApplicationRepository:',
        error
      );
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error while counting job applications'
      );
    }
  }

  async countTotal(dateQuery: any = {}): Promise<number> {
    return await JobApplicationModel.countDocuments(dateQuery);
  }

  async getStatusDistribution(
    query: any
  ): Promise<Array<{ name: string; value: number }>> {
    return await JobApplicationModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          name: '$_id',
          value: 1,
          _id: 0,
        },
      },
      {
        $sort: { value: -1 },
      },
    ]);
  }
}
