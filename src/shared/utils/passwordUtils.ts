import bcrypt from 'bcrypt'
import { CustomError } from '../error/customError';

export const hashPassword = async (password : string) => {
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
      return hashedPassword
    } catch (error) {
      throw new CustomError(500, "Error hashing password");
    }
}


export const comparePassword = async (hashedPassword : string, userPassword : string) => {
    try {
        const isPasswordValid = await bcrypt.compare(hashedPassword, userPassword);
      return isPasswordValid
    } catch (error) {
      throw new CustomError(500, "Error hashing password");
    }
}