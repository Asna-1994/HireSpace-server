export interface SendOtpDTO {
  email: string;
   otp : string
}


export interface SendSubscriptionExpiredEmailDTO{
email: string;
 userName: string
}

export interface  SendVerificationStatusDTO {
email: string;
 companyName: string;
  status: 'approved' | 'rejected';
}

export interface SentOtpSmsDTO{
    phoneNumber: string;
     otp: string
}

