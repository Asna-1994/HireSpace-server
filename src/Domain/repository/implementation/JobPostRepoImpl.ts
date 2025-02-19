import { JobPost, normalizeJobPost } from '../../entities/JobPostEntity';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { CustomError } from '../../../shared/error/customError';
import { JobPostModel } from '../../../Infrastructure/models/JobPostModel';

import { JobPostRepository } from '../repo/jobPostRepository';

export class JobPostRepositoryImpl implements JobPostRepository {
  async findOne(companyId: string): Promise<JobPost> {
    const jobPost = await JobPostModel.findOne({ companyId: companyId }).lean();

    return normalizeJobPost(jobPost);
  }

  async find(filter: object): Promise<JobPost[]> {
    const jobPosts = await JobPostModel.find(filter)
      .populate('postedBy', 'userName email')
      .populate(
        'companyId',
        'companyName email phone address industry companyLogo'
      );
    console.log('saved posts', jobPosts);
    return jobPosts.map(normalizeJobPost);
  }

  async findPostsWithPagination(
    offset: number,
    limit: number,
    filter: object
  ): Promise<JobPost[] | []> {
    try {
      const jobPosts = await JobPostModel.find(filter)
        .populate('companyId', 'companyName email phone address companyLogo')
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

  async findById(jobPostId: string): Promise<JobPost> {
    const jobPost = await JobPostModel.findById(jobPostId).lean();

    return normalizeJobPost(jobPost);
  }

  async update(jobPost: JobPost): Promise<JobPost> {
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
    return normalizeJobPost(updatedPost);
  }

  async findOneAndUpdate(
    filter: object,
    update: object,
    options: object
  ): Promise<JobPost | null> {
    const jobPost = await JobPostModel.findOneAndUpdate(
      filter,
      update,
      options
    ).lean();
    return jobPost ? normalizeJobPost(jobPost) : null;
  }

  async findByIdAndUpdate(
    jobPostId: string,
    update: object,
    options: object
  ): Promise<JobPost | null> {
    const jobPost = await JobPostModel.findByIdAndUpdate(
      jobPostId,
      update,
      options
    ).lean();
    return jobPost ? normalizeJobPost(jobPost) : null;
  }

  async create(jobPost: JobPost): Promise<JobPost> {
    const newJobPost = new JobPostModel(jobPost);
    await newJobPost.save();
    return normalizeJobPost(newJobPost);
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
