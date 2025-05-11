import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { STATUS_CODES } from '../../shared/constants/statusCodes';
import { CustomError } from '../../shared/error/customError';
import { MESSAGES } from '../../shared/constants/messages';
import { DecodedToken } from '../../types/express';
import { UserRepositoryImpl } from '../../Domain/repository/implementation/userRepositoryImpl';
import { CompanyRepositoryImpl } from '../../Domain/repository/implementation/companyRepoImpl';


const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';




export const isCompany = (
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

export const isAdmin = (
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



export const checkIfAUthenticated = async (
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
      
      // Check if user/company is blocked
      await validateEntityNotBlocked(req);
      
      next();
    } catch (tokenError: any) {
      // For token expired errors, just return 401
      // The frontend will handle refreshing the token
      if (tokenError.name === 'TokenExpiredError') {
        throw new CustomError(
          STATUS_CODES.UNAUTHORIZED,
          'Token expired'
        );
      } else {
        // For other JWT errors, return unauthorized
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



// Helper function to validate that user/company is not blocked
async function validateEntityNotBlocked(req: Request) {
  const userId = req.user?.id;
  
  if (req.user?.entity === 'user') {
    const userRepository = new UserRepositoryImpl();
    const user = await userRepository.findById(userId!);
    if (user?.isBlocked) {
      throw new CustomError(
        STATUS_CODES.FORBIDDEN,
        'Account is blocked, Please contact admin'
      );
    }
  } else if (req.user?.entity === 'company') {
    const companyRepository = new CompanyRepositoryImpl();
    const company = await companyRepository.findById(userId!);
    if (company?.isBlocked) {
      throw new CustomError(
        STATUS_CODES.FORBIDDEN,
        'Account is blocked, Please contact admin'
      );
    }
  }
}





