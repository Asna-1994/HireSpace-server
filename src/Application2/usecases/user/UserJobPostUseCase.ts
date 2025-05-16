import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { IJobPostRepository } from '../../../Domain2/respositories/IJobPostRepository';
import { IUserRepository } from '../../../Domain2/respositories/IUserRepository';
import { ISpamRepository } from '../../../Domain2/respositories/ISpamRepo';
import { ISpamReportDTO } from '../../dto/Spam/SpamReportDTO';
import { ISpamReport } from '../../../Domain2/entities/SpamReports';

export class UserJobPostUseCase {
  constructor(
    private jobPostRepository: IJobPostRepository,
    private userRepository: IUserRepository,
    private spamRepository: ISpamRepository
  ) {}

  async getAllJobPostForUser({
    page = 1,
    limit = 10,
    searchTerm = '',
    tagLine = '',
  }: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    tagLine?: string;
  }) {
    try {
      const offset = (page - 1) * limit;
      const filter: any = {
        isDeleted: false,
        isBlocked : false,
      };

      if (searchTerm) {
        filter.$or = [
          { 'companyId.companyName': { $regex: searchTerm, $options: 'i' } },
          { 'companyId.email': { $regex: searchTerm, $options: 'i' } },
          { jobTitle: { $regex: searchTerm, $options: 'i' } },
        ];
      } else if (tagLine) {
        const keywords = tagLine
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 2);

        if (keywords.length > 0) {
          filter.$or = keywords.map((keyword) => ({
            jobTitle: { $regex: keyword, $options: 'i' },
          }));
        }
      }

      const allJobPosts = await this.jobPostRepository.findPostsWithPagination(
        offset,
        limit,
        filter
      );
      return allJobPosts;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error while getting job posts'
      );
    }
  }

  async getSavedJobPost(userId: string, page: number, limit: number) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new CustomError(
          STATUS_CODES.NOT_FOUND,
      MESSAGES.NO_PROFILE_FOUND
        );
      }

      const offset = (page - 1) * limit;
      const savedJobPostIds = user.savedJobs;
      const savedJobPosts =
        await this.jobPostRepository.findPostsWithPagination(offset, limit, {
          _id: { $in: savedJobPostIds },
        });

      console.log('saved jobs', savedJobPosts);
      return savedJobPosts;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error while getting saved job posts'
      );
    }
  }

  async reportSpam(data: Partial<ISpamReport>): Promise<ISpamReportDTO> {
    const spamReport = await this.spamRepository.createSpam(data);
    return spamReport;
  }
}
