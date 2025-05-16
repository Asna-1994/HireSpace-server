
import { imageObject } from "../../../Domain2/entities/User";

 interface ICompanyDTO {
  _id: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  companyLogo: imageObject; 
}



export interface IJobPostDTO {
  companyId: ICompanyDTO;
  jobTitle: string;
  _id: string;
  description: string;
  skillsRequired: string[];
  responsibilities: string[];
  salaryRange: {
    min : string,
    max : string,
    currency : string
  };
  location: {
      city: string;
  state: string;
  country: string;
  remote: boolean;
  }
  jobType: string;
  workMode: string;
  isDeleted: boolean;
  isBlocked : boolean;
  experienceLevel: string;
  educationRequired: string;
  postedBy: string;
  applicationDeadline: Date;
  employmentStartDate: Date;
  numberOfVacancies: number;
  benefits: string[];
  createdAt: Date;
  updatedAt: Date;
  status: string;

}
