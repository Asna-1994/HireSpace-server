import jwt from 'jsonwebtoken';
import { IAuthService } from '../../Domain2/services/IUserAuthService';
import bcrypt from 'bcrypt'
import { generateTokenDTO } from '../../Application2/dto/user-auth/TokenDTO';


const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'my_secret'

export class AuthService implements IAuthService {

  generateAccessToken(payload : generateTokenDTO): string {
    return jwt.sign(
      payload,
     JWT_SECRET ,
      { expiresIn: '3m' }
    );
  }

  generateRefreshToken(payload : generateTokenDTO): string {
    return jwt.sign(
      payload,
   REFRESH_TOKEN_SECRET,
      { expiresIn: '7d'}
    );
  }

  verifyAccessToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
  }

    verifyRefreshToken(token: string): any {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}