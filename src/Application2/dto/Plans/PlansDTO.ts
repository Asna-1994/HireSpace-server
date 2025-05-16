export interface IPlansDTO {
  _id?: string;
  planType: string;
  price: number;
  userType: 'user' | 'company';
  durationInDays: number;
  features: string[];
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;


}