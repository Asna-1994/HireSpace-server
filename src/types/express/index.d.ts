import { Company } from './../../Domain/entities/Company';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../../Domain/entities/User';

export interface DecodedToken {
  id: string;
  role: string;
  email: string;
  entity: string;
  companyId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
      originalRequest?: {
        url: string;
        method: string;
        body: any;
      };
    }
  }
}


