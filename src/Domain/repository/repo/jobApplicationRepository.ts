import { JobApplication } from '../../entities/JobApplication';

export interface JobApplicationRepository {
  findOne(filter: object): Promise<JobApplication | null>;
  findApplicationWithPagination(
    offset: number,
    limit: number,
    filter: object
  ): Promise<{ jobApplications: JobApplication[]; totalApplications: number }>;
  count(filter: Record<string, any>): Promise<number>;
  find(filter: object): Promise<JobApplication[] | []>;
  findById(jobApplicationId: string): Promise<JobApplication | null>;
  update(JobApplication: JobApplication): Promise<JobApplication | null>;
  create(
    JobApplication: Partial<JobApplication>
  ): Promise<JobApplication | null>;
  countTotal(dateQuery: any): Promise<number>;
  getStatusDistribution(
    query: any
  ): Promise<Array<{ name: string; value: number }>>;
  findOneAndUpdate(
    filter: object,
    update: object,
    options: object
  ): Promise<JobApplication | null>;
  findByIdAndUpdate(
    jobApplicationId: string,
    update: object,
    options: object
  ): Promise<JobApplication | null>;
}
