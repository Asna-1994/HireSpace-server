import mongoose from 'mongoose';

export interface CoverLetter {
  salutation: string;
  body: string;
  closing: string;
}

export interface IJobApplication {
  _id: mongoose.Types.ObjectId ;
  userId: mongoose.Types.ObjectId  ;
  jobPostId: mongoose.Types.ObjectId ;
  companyId: mongoose.Types.ObjectId ;
  coverLetter: CoverLetter;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedDate: Date;
  updatedDate: Date;
  resumeUrl: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

}


