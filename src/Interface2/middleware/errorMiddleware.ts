import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../shared/error/customError';
import { MESSAGES } from '../../shared/constants/messages';
import { STATUS_CODES } from '../../shared/constants/statusCodes';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  console.error(err);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      statusCode: err.statusCode,
    });
  }

  return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: MESSAGES.INTERNAL_SERVER_ERROR,
    statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
  });
};
