export class TempCompany {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  establishedDate: Date;
  industry: string;
  password: string;
  otp: string;
  otpExpiry: Date;
  companyAdminEmail: string;

  constructor(data: Partial<TempCompany>) {
    this.companyName = data.companyName!;
    this.email = data.email!;
    this.phone = data.phone!;
    this.address = data.address!;
    this.establishedDate = data.establishedDate!;
    this.industry = data.industry!;
    this.password = data.password!;
    this.otp = data.otp!;
    this.otpExpiry = data.otpExpiry!;
    this.companyAdminEmail = data.companyAdminEmail!;
  }

  validateEmail(): void {
    if (!this.email.includes("@")) {
      throw new Error("Invalid email address");
    }
  }
}
