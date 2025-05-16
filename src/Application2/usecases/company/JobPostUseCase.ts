import { deNormalizeJobPost } from './../../../shared/utils/Normalisation/normalisJobPost';
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import mongoose from 'mongoose';
import { ICompanyRepository } from '../../../Domain2/respositories/ICompanyRepository';
import { IJobPostRepository } from '../../../Domain2/respositories/IJobPostRepository';
import { CreateJobPostDTO } from '../../dto/JobPost/createJobPostDTO';



export class JobPostUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private jobPostRepository: IJobPostRepository
  ) {}


async createJobPost(inputData:CreateJobPostDTO) {

    const { companyId, userId, jobPostId, jobPostData } = inputData;

 
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.COMPANY_NOT_FOUND);
    }


    const isAuthorized = company.members.some(
      (member) =>
        member.userId.toString() === userId &&
        ['companyAdmin', 'companyMember'].includes(member.role)
    );

    if (!isAuthorized) {
      throw new CustomError(STATUS_CODES.FORBIDDEN, MESSAGES.NOT_AUTHORIZED);
    }


    if (jobPostId) {
    const existingJobPost = await this.jobPostRepository.findById(jobPostId);
    console.log('existing post' ,existingJobPost)
    if (!existingJobPost) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.NOT_FOUND);
    }

    // Clean object with only what is needed
    const updatedJobPost = {
      ...jobPostData,
      _id: new mongoose.Types.ObjectId(existingJobPost._id),
      companyId: new mongoose.Types.ObjectId(existingJobPost.companyId._id) , 
      postedBy: new mongoose.Types.ObjectId(existingJobPost.postedBy) ,  
    };



    await this.jobPostRepository.update(updatedJobPost);
    } else {
      await this.jobPostRepository.create({
        ...jobPostData,
        companyId: new mongoose.Types.ObjectId(companyId),
        postedBy: new mongoose.Types.ObjectId(userId),
      });
    }
  }

  //get all post by companyId

  async getAllJobPostByCompanyId(companyId: string) {
    try {
      const allJobPosts = await this.jobPostRepository.find({
        companyId: companyId,
        isDeleted: false,
        isBlocked : false,
      });
      return allJobPosts;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error while getting job posts by company Id'
      );
    }
  }

  //delete job post
  async deleteJobPostById(jobPostId: string) {
    try {
      const deletedPost = await this.jobPostRepository.findByIdAndUpdate(
        jobPostId,
        { isDeleted: true },
        { new: true }
      );
      return deletedPost;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error while deleting job posts '
      );
    }
  }
}
