import { check } from 'express-validator';

export const addEducationValidationRules = [
  check('educationName')
    .isString()
    .withMessage('Education name must be a string')
    .isLength({ min: 5 })
    .withMessage('Education name must be at least 5 characters long'),

    check('yearOfPassing')
    .isString()
    .withMessage('Year of passing must be a string')
    .isLength({ min: 4, max: 4 })
    .withMessage('Year of passing must be a 4-digit string')
    .custom((value) => {
      const currentYear = new Date().getFullYear().toString();
      if (parseInt(value) > parseInt(currentYear)) {
        throw new Error('Year of passing cannot be in the future');
      }
      return true;
    }),

  check('markOrGrade')
    .isString()
    .withMessage('Mark or grade must be a string')
    .isLength({ min: 1 })
    .withMessage('Mark or grade must be at least 1 character long'),

  check('schoolOrCollege')
    .isString()
    .withMessage('School or college name must be a string')
    .isLength({ min: 3 })
    .withMessage('School or college name must be at least 3 characters long'),

  check('subject')
    .isString()
    .withMessage('Subject must be a string')
    .isLength({ min: 3 })
    .withMessage('Subject must be at least 3 characters long'),

  check('universityOrBoard')
    .isString()
    .withMessage('University or board name must be a string')
    .isLength({ min: 3 })
    .withMessage('University or board name must be at least 3 characters long'),
];


export const editUserProfileValidationRules = [

  
    check("userName")
    .optional()
      .isString()
      .withMessage("Username must be a string")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),

    check("phone")
    .optional()
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone number must be 10 digits")
      .matches(/^(?!0)(?!([0-9])\1{9})\d{10}$/)
      .withMessage(
        "Phone number must not start with 0 or consist of all the same digit"
      ),
    
      check("dateOfBirth")
      .optional()
      .isISO8601()
      .withMessage("Date of Birth must be a valid ISO8601 date"),
  
    check("address")
    .optional()
    .isString()
      .withMessage("Address must be string"),

  ];


  export const validateExperienceData = [
    check('company')
      .isString()
      .notEmpty()
      .withMessage('Company is required and must be a string'),
    check('designation')
      .isString()
      .notEmpty()
      .withMessage('Designation is required and must be a string'),
    check('yearCompleted')
      .isString()
      .notEmpty()
      .withMessage('Year completed is required and must be a string'),
    check('dateFrom')
      .isString()
      .matches(/^\d{2}-\d{2}-\d{4}$/)
      .withMessage('Date from must be in the format dd-mm-yyyy'),
    check('dateTo')
      .isString()
      .matches(/^\d{2}-\d{2}-\d{4}$/)
      .withMessage('Date to must be in the format dd-mm-yyyy'),
    check('skillsGained')
      .isArray({ min: 1 })
      .withMessage('Skills gained must be an array of strings')
      .custom((skills) => {
        if (!skills.every((skill: string) => typeof skill === 'string')) {
          throw new Error('Each skill must be a string');
        }
        return true;
      }),
  ];