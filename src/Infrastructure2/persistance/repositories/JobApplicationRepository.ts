
import { IJobApplicationDTO, IJobApplicationDTONotPopulatedFields } from '../../../Application2/dto/JobApplication/JobApplicationDTO';
import { IJobApplication } from '../../../Domain2/entities/JobApplication';
import { IJobApplicationRepository } from '../../../Domain2/respositories/IJobApplicationRepo';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { CustomError } from '../../../shared/error/customError';
import { normalizeApplicationNotPopulated, normalizeJobApplication } from '../../../shared/utils/Normalisation/normaliseJobApplicaiton';
import { JobApplicationModel } from '../models/JobApplicationModel';




export class JobApplicationRepository implements IJobApplicationRepository {

  async findOne(filter: object): Promise<IJobApplicationDTONotPopulatedFields | null> {
    const jobApplication = await JobApplicationModel.findOne(filter).lean();
    console.log("Job applicatioon from repo",jobApplication)
    return jobApplication ? normalizeApplicationNotPopulated(jobApplication) : null;
  }

  async find(filter: object): Promise<IJobApplicationDTO[] | []> {
    const jobApplications = await JobApplicationModel.find(filter)
      .populate('userId', 'userName email phone address profilePhoto')
      .populate({
        path: 'jobPostId',
        populate: {
          path: 'companyId',
          select: 'companyName email phone address industry companyLogo',
        },
      }).sort({ createdAt: -1 })
    return jobApplications as IJobApplicationDTO[] | [];
  }

  async findApplicationWithPagination(
    offset: number,
    limit: number,
    filter: object
  ): Promise<{ jobApplications: IJobApplicationDTO[]; totalApplications: number }> {
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
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);


       
      const totalApplications =
        await JobApplicationModel.countDocuments(filter);

      console.log('Job applications in repo', jobApplications);
      return {
        jobApplications: jobApplications.map(normalizeJobApplication) ,
        totalApplications,
      };
    } catch (err) {
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Failed to return data from repository'
      );
    }
  }

  async findById(jobApplicationId: string): Promise<IJobApplicationDTONotPopulatedFields | null> {
    const jobApplication =
      await JobApplicationModel.findById(jobApplicationId).lean();
    return jobApplication ? normalizeApplicationNotPopulated(jobApplication) : null;
  }

  async update(jobApplication: IJobApplication): Promise<IJobApplicationDTONotPopulatedFields> {
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
    return normalizeApplicationNotPopulated(updatedApplication);
  }

  async findOneAndUpdate(
    filter: object,
    update: object,
    options: object
  ): Promise<IJobApplicationDTONotPopulatedFields | null> {
    const jobApplication = await JobApplicationModel.findOneAndUpdate(
      filter,
      update,
      options
    ).lean();
    return jobApplication ?  normalizeApplicationNotPopulated(jobApplication) : null ;
  }

  async findByIdAndUpdate(
    jobApplicationId: string,
    update: object,
    options: object
  ): Promise<IJobApplicationDTONotPopulatedFields | null> {
    const jobApplication = await JobApplicationModel.findByIdAndUpdate(
      jobApplicationId,
      update,
      options
    ).lean();
    return jobApplication ?  normalizeApplicationNotPopulated(jobApplication) : null ;
  }

  async create(
    jobApplication: Partial<IJobApplication>
  ): Promise<void> {
    try{
    const newJobApplication = new JobApplicationModel(jobApplication);
    await newJobApplication.save();
    console.log('application creted in reposoroty', newJobApplication);
    }
    catch(err){
      console.log(err)
           throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,'Error while creating job applications'
      );
    }

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
