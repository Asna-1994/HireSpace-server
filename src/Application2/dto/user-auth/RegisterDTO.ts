export interface RegisterRequestDTO {
    userName: string;
    email: string;
    dateOfBirth: Date;
    phone: string;
    address: string;
    userRole: string;
    password: string;
}

export interface RegisterResponseDTO {
    _id  : string;
    userName: string;
    email: string;
    dateOfBirth: Date;
    phone: string;
    address: string;
    userRole: string;
  accessToken: string;
  refreshToken: string;
}