import { check, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';

export const userSignupValidationRules = [
  check('userName')
    .isString()
    .withMessage('Username must be a string')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),

  check('email').isEmail().withMessage('Please provide a valid email address'),

  check('phone')
    .isLength({ min: 10, max: 10 })
    .withMessage('Phone number must be 10 digits')
    .matches(/^(?!0)(?!([0-9])\1{9})\d{10}$/)
    .withMessage(
      'Phone number must not start with 0 or consist of all the same digit'
    ),

  check('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[\W_]/)
    .withMessage('Password must contain at least one special character'),

  check('dateOfBirth')
    .isISO8601()
    .withMessage('Date of Birth must be a valid ISO8601 date'),

  check('address').isString().withMessage('Address must be string'),
];

export const companySignupValidationRules = [
  check('companyName')
    .isString()
    .withMessage('Company name must be a string')
    .isLength({ min: 3 })
    .withMessage('Company name must be at least 3 characters long'),

  check('email').isEmail().withMessage('Please provide a valid email address'),
  check('companyAdminEmail')
    .isEmail()
    .withMessage('Please provide a valid email for admin'),

  check('phone')
    .isLength({ min: 10, max: 10 })
    .withMessage('Phone number must be 10 digits')
    .matches(/^(?!0)(?!([0-9])\1{9})\d{10}$/)
    .withMessage(
      'Phone number must not start with 0 or consist of all the same digit'
    ),

  check('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[\W_]/)
    .withMessage('Password must contain at least one special character'),

  check('establishedDate')
    .isISO8601()
    .withMessage('Date of Birth must be a valid ISO8601 date'),

  check('address').isString().withMessage('Address must be string'),
  check('industry')
    .isString()
    .withMessage('Industry must be a string')
    .isLength({ min: 2 })
    .withMessage('Industry must be at least 2 characters long'),
];

export const companyEditValidationRules = [
  check('companyName')
    .optional()
    .isString()
    .withMessage('Company name must be a string')
    .isLength({ min: 3 })
    .withMessage('Company name must be at least 3 characters long'),

  check('phone')
    .optional()
    .isLength({ min: 10, max: 10 })
    .withMessage('Phone number must be 10 digits')
    .matches(/^(?!0)(?!([0-9])\1{9})\d{10}$/)
    .withMessage(
      'Phone number must not start with 0 or consist of all the same digit'
    ),

  check('establishedDate')
    .optional()
    .isISO8601()
    .withMessage('Date of Birth must be a valid ISO8601 date'),

  check('address').optional().isString().withMessage('Address must be string'),

  check('industry')
    .optional()
    .isString()
    .withMessage('Industry must be a string')
    .isLength({ min: 2 })
    .withMessage('Industry must be at least 2 characters long'),
];

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];

    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: firstError.msg,
    });
    return;
  }
  next();
};
