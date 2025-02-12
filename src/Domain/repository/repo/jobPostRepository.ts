import { JobPost } from "../../entities/JobPostEntity";

export interface JobPostRepository {
  findOne(companyId: string): Promise<JobPost | null>;
  findPostsWithPagination(
    offset: number,
    limit: number,
    filter: object,
  ): Promise<JobPost[] | []>;
  find(filter: object): Promise<JobPost[] | []>;
  findById(jobPostId: string): Promise<JobPost | null>;
  update(JobPost: JobPost): Promise<JobPost>;
  create(JobPost: Partial<JobPost>): Promise<JobPost>;
  findOneAndUpdate(
    filter: object,
    update: object,
    options: object,
  ): Promise<JobPost | null>;
  findByIdAndUpdate(
    jobPostId: string,
    update: object,
    options: object,
  ): Promise<JobPost | null>;
  countTotal(dateQuery: any): Promise<number>;
}
