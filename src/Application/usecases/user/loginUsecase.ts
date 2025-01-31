import { JobSeekerProfileRepository } from './../../../Domain/repository/repo/JobSeekerProfileRepo';
import { UserRepository } from '../../../Domain/repository/repo/userRepository';
import { CustomError } from "../../../shared/error/customError";
import {  generateToken } from "../../../shared/utils/tokenUtils";
import { comparePassword, hashPassword } from '../../../shared/utils/passwordUtils';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';


export class LoginUseCase {
  constructor(
    private UserRepository : UserRepository,
    private jobSeekerProfileRepository : JobSeekerProfileRepository
  ) {}

  async execute(userData: {
  
    email: string;
    password: string;
    
  }) {
    const { email , password} = userData;

    const existingUser = await this.UserRepository.findByEmail(email);
    if (!existingUser) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
    }

    if(existingUser.isBlocked){
      throw new CustomError(STATUS_CODES.FORBIDDEN, MESSAGES.BLOCKED);
    }
    
    const isPasswordValid = await comparePassword(password, existingUser.password as string)

    if(!isPasswordValid){
        throw new CustomError(STATUS_CODES.UNAUTHORIZED, MESSAGES.INVALID_PASSWORD);
    }

 
    if (existingUser.userRole !== 'jobSeeker') {
      throw new CustomError(
          STATUS_CODES.UNAUTHORIZED,
          "You are not registered as a job seeker. If you are company member please login from company side"
      );
  }
   
  const jobSeekerProfile = await this.jobSeekerProfileRepository.findOne({userId : existingUser._id})

    const token =  generateToken({id : existingUser._id , email :  existingUser.email, role : existingUser.userRole, entity : 'user'})

    return { token, user: existingUser,jobSeekerProfile };
  }

}
