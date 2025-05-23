
import { IJobPostDTO } from '../../../Application2/dto/JobPost/JobPostDTO';
import { IJobPost } from '../../../Domain2/entities/JobPost';
import { IJobPostRepository } from '../../../Domain2/respositories/IJobPostRepository';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { CustomError } from '../../../shared/error/customError';
import { normalizeJobPost } from '../../../shared/utils/Normalisation/normalisJobPost';
import { JobPostModel } from '../models/JobPostModel';





export class JobPostRepository implements IJobPostRepository {

  async findOne(companyId: string): Promise<IJobPostDTO | null> {
    const jobPost = await JobPostModel.findOne({ companyId: companyId }).lean();

    return jobPost ? normalizeJobPost(jobPost) : null;
  }

  async find(filter: object): Promise<IJobPostDTO[]> {
    const jobPosts = await JobPostModel.find(filter)
      .populate('postedBy', 'userName email')
      .populate(
        'companyId',
        'companyName email phone address industry companyLogo'
      ).sort({ createdAt: -1 })
    console.log('saved posts', jobPosts);
    return jobPosts.map(normalizeJobPost);
  }

  async findPostsWithPagination(
    offset: number,
    limit: number,
    filter: object
  ): Promise<IJobPostDTO[] | []> {
    try {
      const jobPosts = await JobPostModel.find(filter)
        .populate('companyId', 'companyName email phone address companyLogo')
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);

      // console.log("job application in repo",jobPosts)

      return jobPosts.map(normalizeJobPost);
    } catch (err) {
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'failed to return data  from repository'
      );
    }
  }

  async findById(jobPostId: string): Promise<IJobPostDTO | null> {
    const jobPost = await JobPostModel.findById(jobPostId).lean();

    return jobPost ? normalizeJobPost(jobPost)  : null;
  }

  async update(jobPost: Partial<IJobPost>): Promise<void> {
    try{
    const updatedPost = await JobPostModel.findByIdAndUpdate(
      jobPost._id,
      jobPost,
      { new: true }
    )
      .lean()
      .exec();
    if (!updatedPost) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, 'Post not found');
    }
    }catch(err){
console.log(err)
    }

   
  }

  async findOneAndUpdate(
    filter: object,
    update: object,
    options: object
  ): Promise<IJobPostDTO | null> {
    const jobPost = await JobPostModel.findOneAndUpdate(
      filter,
      update,
      options
    ).lean();
    return jobPost ? normalizeJobPost(jobPost) : null;
  }

  async findByIdAndDelete(jobPostId: string, ): Promise<void> {
 await JobPostModel.findByIdAndDelete(jobPostId)
  }

  async findByIdAndUpdate(
    jobPostId: string,
    update: object,
    options: object
  ): Promise<IJobPostDTO | null> {
    const jobPost = await JobPostModel.findByIdAndUpdate(
      jobPostId,
      update,
      options
    ).lean();
    return jobPost ? normalizeJobPost(jobPost) : null;
  }

  async create(jobPost: IJobPost): Promise<void> {
    const newJobPost = new JobPostModel(jobPost);
    await newJobPost.save();
  }

  async countTotal(dateQuery: any = {}): Promise<number> {
    return await JobPostModel.countDocuments(dateQuery);
  }

  async updateMany(
    filter: Record<string, unknown>,
    updateData: Record<string, unknown>
  ): Promise<void> {
    await JobPostModel.updateMany(filter, updateData).exec();
  }
}
