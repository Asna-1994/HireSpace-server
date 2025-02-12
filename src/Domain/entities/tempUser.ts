export class TempUser {
  userName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: Date;
  userRole: string;
  password: string;
  otp: string;
  otpExpiry: Date;

  constructor(data: Partial<TempUser>) {
    this.userName = data.userName!;
    this.email = data.email!;
    this.phone = data.phone!;
    this.address = data.address!;
    this.dateOfBirth = data.dateOfBirth!;
    this.userRole = data.userRole!;
    this.password = data.password!;
    this.otp = data.otp!;
    this.otpExpiry = data.otpExpiry!;
  }

  validateEmail(): void {
    if (!this.email.includes("@")) {
      throw new Error("Invalid email address");
    }
  }
}
