
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { STATUS_CODES } from '../../shared/constants/statusCodes';
import { CustomError } from '../../shared/error/customError';
import { MESSAGES } from '../../shared/constants/messages';
import { DecodedToken } from '../../types/express';
import { ValidateEntityNotBlockedUseCase } from '../../Application2/usecases/shared/ValidateEntityNotBlocked';


const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';

export class AuthenticationMiddleware{
    constructor(private validateEntity : ValidateEntityNotBlockedUseCase){}

 isCompany = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = req.user;
  
  if (
    !user ||
    !('role' in user) ||
    (user.role !== 'companyMember' && user.role !== 'companyAdmin')
  ) {
    throw new CustomError(STATUS_CODES.FORBIDDEN, MESSAGES.FORBIDDEN);
  }
  
  next();
};


isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = req.user;
  
  if (!user || !('role' in user) || user.role !== 'admin') {
    throw new CustomError(STATUS_CODES.FORBIDDEN, MESSAGES.FORBIDDEN);
  }
  
  next();
};



checkIfAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.authToken;
    console.log('authToken:', token);
    console.log('refreshToken:', req.cookies.refreshToken);
    
    if (!token) {
      throw new CustomError(
        STATUS_CODES.UNAUTHORIZED,
       MESSAGES.PLEASE_LOGIN
      );
    }

    try {
  
      const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
      req.user = decoded;
      

      await this.validateEntity.execute(decoded);
      
      next();
    } catch (tokenError: any) {
      if (tokenError.name === 'TokenExpiredError') {
        throw new CustomError(
          STATUS_CODES.UNAUTHORIZED,
          'Token expired'
        );
      } else {
        throw new CustomError(
          STATUS_CODES.UNAUTHORIZED, 
          MESSAGES.INVALID_TOKEN 
        );
      }
    }
  } catch (error) {
    next(error);
  }
};

}








