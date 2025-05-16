export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
 _id: string;
  email: string;
  userName: string;
  userRole: string;
  accessToken: string;

}
