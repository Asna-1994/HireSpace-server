import nodemailer from 'nodemailer';
import { IEmailService } from '../../Domain2/services/IEmailService';
import { SendOtpDTO, SendSubscriptionExpiredEmailDTO, SendVerificationStatusDTO, SentOtpSmsDTO } from '../../Application2/dto/mail/MailDTO';
import { STATUS_CODES } from '../../shared/constants/statusCodes';
import { CustomError } from '../../shared/error/customError';
import twilio from 'twilio';


export class EmailService implements IEmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  
  });
      private client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  );

  async sendOtpEmail(data :SendOtpDTO ): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: data.email,
      subject: 'Your OTP for Signup',
      text: `Your OTP for signup is: ${data.otp}`,
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendVerificationStatusMail(data : SendVerificationStatusDTO): Promise<void> {
    const subject = 'Company Verification Status';
    let text = '';

    if (data.status === 'approved') {
      text = `Dear ${data.companyName},\n\nWe are pleased to
       inform you that your company account has been successfully 
       approved.\n\nThank you,\nThe HireSpace Team`;
    } else {
      text = `Dear ${data.companyName},\n\nWe regret to inform you that
       your company account verification was not approved.\nPlease review your
        application and resubmit.\n\nThank you,\nThe HireSpace Team`;
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: data.email,
      subject,
      text,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendSubscriptionExpiredEmail(data : SendSubscriptionExpiredEmailDTO): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: data.email,
      subject: 'Subscription expired',
      text: `Dear ${data.userName},\n\nYour HireSpace Premium subscription
       has expired.\nPlease upgrade to continue enjoying premium features.
       \n\nThank you,\nThe HireSpace Team`,
    };

    await this.transporter.sendMail(mailOptions);
  }

    async sendOtpSms(data : SentOtpSmsDTO): Promise<void> {
    try {
      const formattedPhone = `+91${data.phoneNumber}`;
      await this.client.messages.create({
        body: `Your OTP for signup is: ${data.otp}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: formattedPhone,
      });
    } catch (error) {
      console.error('Failed to send OTP:', error);
      throw new CustomError(STATUS_CODES.BAD_REQUEST, 'Failed to send OTP');
    }
  }
}
