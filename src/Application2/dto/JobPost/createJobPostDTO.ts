import { Location, SalaryRange } from "../../../Domain2/entities/JobPost";

interface JobPostInput {
  jobTitle: string;
  description: string;
  skillsRequired: string[];
  responsibilities: string[];
  salaryRange: SalaryRange;
  location: Location;
  jobType: string;
  workMode: string;
  experienceLevel: string;
  educationRequired: string;
  applicationDeadline: Date;
  employmentStartDate: Date;
  numberOfVacancies: number;
  benefits: string[];
  status: string;
}

export interface CreateJobPostDTO{
        companyId: string,
    jobPostData: JobPostInput,
    userId: string,
    jobPostId?: string
}
