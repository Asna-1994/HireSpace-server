

export interface AccessTokenResponseDTO {
  accessToken: string;
  refreshToken: string;
}

export interface generateTokenDTO {
    
      id: string;
      email: string;
      role:'jobSeeker'| 'companyAdmin'| 'companyMember'| 'admin',
      entity: 'user' | 'company',

//         id: string;
//   email?: string;
//   role?: string;
//   entity : String;
  [key: string]: any;
    
}