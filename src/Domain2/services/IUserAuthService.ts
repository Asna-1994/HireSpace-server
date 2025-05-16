import {  generateTokenDTO } from "../../Application2/dto/user-auth/TokenDTO";


export interface IAuthService {
  generateAccessToken(data  : generateTokenDTO): string;
  generateRefreshToken(data  : generateTokenDTO): string;
  verifyAccessToken(token: string): any;
    verifyRefreshToken(token: string): any 
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}