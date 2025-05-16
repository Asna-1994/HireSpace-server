import { SendOtpDTO, SendSubscriptionExpiredEmailDTO, SendVerificationStatusDTO, SentOtpSmsDTO } from "../../Application2/dto/mail/MailDTO";

export interface IEmailService {
  sendOtpEmail(data : SendOtpDTO): Promise<void>;
  sendVerificationStatusMail(data : SendVerificationStatusDTO): Promise<void>;
  sendSubscriptionExpiredEmail(data : SendSubscriptionExpiredEmailDTO): Promise<void>;
    sendOtpSms(data :SentOtpSmsDTO): Promise<void>;
}
