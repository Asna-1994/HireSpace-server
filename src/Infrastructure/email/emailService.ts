import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { CustomError } from '../../shared/error/customError';
import { STATUS_CODES } from '../../shared/constants/statusCodes';

export const sendOtpEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Your OTP for Signup',
    text: `Your OTP for signup is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendVerificationStatusMail = async (
  email: string,
  companyName: string,
  status: 'approved' | 'rejected'
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const subject = 'Company Verification Status';
  let text = '';

  if (status === 'approved') {
    text = `Dear ${companyName},\n\nWe are pleased to inform you that your company account has been successfully approved.
     You can now start using our platform.\n\nThank you,\nThe HireSpace Team`;
  } else if (status === 'rejected') {
    text = `Dear ${companyName},\n\nWe regret to inform you that your company account verification was not approved.
      .We encountered some issues during the verification process.
       Please review your application and resubmit with any necessary corrections.\n\nThank you,\nThe HireSpace Team`;
  }
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: subject,
    text: text,
  };

  await transporter.sendMail(mailOptions);
};

export const sendSubscriptionExpiredEmail = async (
  email: string,
  userName: string
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Subscription expired',
    text: `Dear ${userName},\n\nThis email is to inform you that your HireSpace
     Premium subscription has expired.\n\nTo continue enjoying the benefits of our 
     Premium features, please upgrade your subscription.\n\n\nThank you,\nThe HireSpace Team`,
  };

  await transporter.sendMail(mailOptions);
};

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendOtpSms = async (phoneNumber: string, otp: string) => {
  try {
    const formattedPhoneNumber = `+91${phoneNumber}`;
    await client.messages.create({
      body: `Your OTP for signup is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhoneNumber,
    });
    console.log('OTP sent successfully');
  } catch (error) {
    console.error('Failed to send OTP:', error);
    throw new CustomError(STATUS_CODES.BAD_REQUEST, 'Failed to send OTP');
  }
};
