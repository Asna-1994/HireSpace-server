import { IJobPostDTO } from "../../Application2/dto/JobPost/JobPostDTO";
import { IJobPost } from "../entities/JobPost";


export interface IJobPostRepository {
  findOne(companyId: string): Promise<IJobPostDTO | null>;
  findPostsWithPagination(
    offset: number,
    limit: number,
    filter: object
  ): Promise<IJobPostDTO[] | []>;
  find(filter: object): Promise<IJobPostDTO[] | []>;
  findById(jobPostId: string): Promise<IJobPostDTO | null>;
  update(jobPost: Partial<IJobPost>): Promise<void>;
  create(jobPost: Partial<IJobPost>): Promise<void>;
  findOneAndUpdate(
    filter: object,
    update: object,
    options: object
  ): Promise<IJobPostDTO | null>;
  findByIdAndUpdate(
    jobPostId: string,
    update: object,
    options: object
  ): Promise<IJobPostDTO | null>;
  countTotal(dateQuery: any): Promise<number>;
  updateMany(
    filter: Record<string, unknown>,
    updateData: Record<string, unknown>
  ): Promise<void>
}
