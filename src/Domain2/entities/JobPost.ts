import mongoose from 'mongoose';

export interface SalaryRange {
  min: string;
  max: string;
  currency: string;
}

export interface Location {
  city: string;
  state: string;
  country: string;
  remote: boolean;
}



export interface IJobPost {
  companyId: mongoose.Types.ObjectId;
  jobTitle: string;
  _id:  mongoose.Types.ObjectId;
  description: string;
  skillsRequired: string[];
  responsibilities: string[];
  salaryRange: SalaryRange;
  location: Location;
  jobType: string;
  workMode: string;
  isDeleted: boolean;
  isBlocked : boolean;
  experienceLevel: string;
  educationRequired: string;
  postedBy: mongoose.Types.ObjectId;
  applicationDeadline: Date;
  employmentStartDate: Date;
  numberOfVacancies: number;
  benefits: string[];
  createdAt: Date;
  updatedAt: Date;
  status: string;

}


