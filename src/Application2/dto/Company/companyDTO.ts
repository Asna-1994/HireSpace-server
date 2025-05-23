import { imageObject } from "../../../Domain2/entities/User";


export interface ICompanyDTO {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  establishedDate: Date;
  refreshTokens: String [];
  industry: string;
  password : string;
  verificationDocument?: imageObject;
  documentNumber?: string;
  entity: 'company' | 'user';
  _id: string;
  companyLogo?: imageObject;
  appPlan: 'basic' | 'premium';
  isBlocked: boolean;
  isPremium: boolean;
  isVerified: boolean;
  isDeleted: boolean;
  isSpam: boolean;
  members: IMemberDTO[];
  createdAt: Date;
  updatedAt: Date;
  

}


export interface IMemberDTO {
  userId:  string;
  role: 'companyMember' | 'companyAdmin';
  _id?:  string;
}



 




export interface companyRegisterDTO{
        companyName: string;
    email: string;
    establishedDate: Date;
    phone: string;
    address: string;
    industry: string;
    password: string;
    companyAdminEmail: string;
}

 
