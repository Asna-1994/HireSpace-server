export interface ISpamReportDTO {
  _id: string;
  reportedByUser: string;
  companyId: string;
  isDeleted: boolean;
  reason: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;

}
