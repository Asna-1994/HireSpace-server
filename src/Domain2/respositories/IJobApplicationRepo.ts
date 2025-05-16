import { IJobApplicationDTO } from "../../Application2/dto/JobApplication/JobApplicationDTO";
import { IJobApplication } from "../entities/JobApplication";


export interface IJobApplicationRepository {
  findOne(filter: object): Promise<IJobApplicationDTO | null>;
  findApplicationWithPagination(
    offset: number,
    limit: number,
    filter: object
  ): Promise<{ jobApplications: IJobApplicationDTO[]; totalApplications: number }>;
  count(filter: Record<string, any>): Promise<number>;
  find(filter: object): Promise<IJobApplicationDTO[] | []>;
  findById(jobApplicationId: string): Promise<IJobApplicationDTO | null>;
  update(jobApplication: IJobApplication): Promise<IJobApplicationDTO | null>;
  create(
    jobApplication: Partial<IJobApplication>
  ): Promise<void>;
  countTotal(dateQuery: any): Promise<number>;
  getStatusDistribution(
    query: any
  ): Promise<Array<{ name: string; value: number }>>;
  findOneAndUpdate(
    filter: object,
    update: object,
    options: object
  ): Promise<IJobApplicationDTO | null>;
  findByIdAndUpdate(
    jobApplicationId: string,
    update: object,
    options: object
  ): Promise<IJobApplicationDTO | null>;
}
