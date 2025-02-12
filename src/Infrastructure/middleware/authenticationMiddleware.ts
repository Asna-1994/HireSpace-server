import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { STATUS_CODES } from "../../shared/constants/statusCodes";
import { CustomError } from "../../shared/error/customError";
import { MESSAGES } from "../../shared/constants/messages";
import { DecodedToken } from "../../types/express";
import { UserRepositoryImpl } from "../../Domain/repository/implementation/userRepositoryImpl";
import { CompanyRepositoryImpl } from "../../Domain/repository/implementation/companyRepoImpl";

const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret";

export const checkIfAUthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.authToken;
    console.log("Token", token);

    if (!token) {
      throw new CustomError(
        STATUS_CODES.UNAUTHORIZED,
        "You are not authorised, Please login",
      );
    }
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    req.user = decoded;

    console.log("user in request", req.user);
    const userId = req.user?.id;

    if (req.user?.entity === "user") {
      const userRepository = new UserRepositoryImpl();
      const user = await userRepository.findById(userId);
      if (user?.isBlocked) {
        throw new CustomError(
          STATUS_CODES.FORBIDDEN,
          "Account is blocked, Please contact admin",
        );
      }
    }
    if (req.user?.entity === "company") {
      const companyRepository = new CompanyRepositoryImpl();
      const company = await companyRepository.findById(userId);
      if (company?.isBlocked) {
        throw new CustomError(
          STATUS_CODES.FORBIDDEN,
          "Account is blocked, Please contact admin",
        );
      }
    }
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      next(
        new CustomError(
          STATUS_CODES.UNAUTHORIZED,
          "Token expired, please login again",
        ),
      );
    } else {
      next(error);
    }
  }
};

export const isCompany = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const user = req.user;
  console.log("user in the middle ware", user);
  if (
    !user ||
    !("role" in user) ||
    (user.role !== "companyMember" && user.role !== "companyAdmin")
  ) {
    throw new CustomError(STATUS_CODES.FORBIDDEN, MESSAGES.FORBIDDEN);
  }

  next();
};

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const user = req.user;
  console.log("user in admin", user);

  if (!user || !("role" in user) || user.role !== "admin") {
    throw new CustomError(STATUS_CODES.FORBIDDEN, MESSAGES.FORBIDDEN);
  }

  next();
};
