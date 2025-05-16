


export interface ICompanyProfileDTO {
  companyId: string;
  _id: string;
  mission?: string;
  vision?: string;
  founder?: string;
  ceo?: string;
  description?: string;
  aboutUs?: string;
  website?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;

}


export interface HandleFileDTO{
  filePath: string,
  companyId: string,
  folder: string,
  fieldToUpdate: 'companyLogo' | 'verificationDocument',
  documentNumber?: string
}





