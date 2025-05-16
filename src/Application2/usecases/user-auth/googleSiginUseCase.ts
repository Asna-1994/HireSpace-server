import { CustomError } from '../../../shared/error/customError';
import { OAuth2Client } from 'google-auth-library';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { IUserRepository } from '../../../Domain2/respositories/IUserRepository';
import { IAuthService } from '../../../Domain2/services/IUserAuthService';
import { User } from '../../../Domain2/entities/User';


export class GoogleSignInUseCase {
  private oauthClient: OAuth2Client;
constructor(
        private userRepository: IUserRepository,
       private authService : IAuthService

  ) {
    this.oauthClient = new OAuth2Client(process.env.oauth_client_id);
  }

   execute =  async (credential: string) =>  {
    const ticket = await this.oauthClient.verifyIdToken({
      idToken: credential,
      audience: process.env.oauth_client_id,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, MESSAGES.INVALID_GOOGLE_TOKEN);
    }

    const { sub: googleId, name, email, picture: profilePicture } = payload;

    if (!email) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
        'Email is required for Google authentication'
      );
    }

    const userName: string = name ?? email.split('@')[0];

    let existingUser = await this.userRepository.findByGoogleId(googleId);

    if (!existingUser) {
      existingUser = await this.userRepository.findByEmail(email);

      if (existingUser) {
        existingUser.googleId = googleId;
        // existingUser.profilePhoto?.url = profilePicture;
        await this.userRepository.update(existingUser);
      } else {
        const newUserData: Partial<User> = {
          googleId,
          userName: userName,
          email,
          // profilePhoto: profilePicture,
          entity: 'user',
          userRole : 'jobSeeker',
          isBlocked: false,
          isPremium: false,
          isVerified: false,
          isDeleted: false,
          isFresher: true,
          isSpam: false,
        };

        existingUser = await this.userRepository.create(newUserData);
      }
    }

    const token = this.authService.generateAccessToken({
      id: existingUser._id.toString(),
      email: existingUser.email,
      role: existingUser.userRole!,
      entity: 'user',
    });
    const refreshToken = this.authService .generateRefreshToken({
      id: existingUser._id.toString(),
      email: existingUser.email,
      role: existingUser.userRole!,
      entity: 'user',
    });
    
    await this.userRepository.saveRefreshToken(existingUser._id.toString(), refreshToken);

    return {
      user: existingUser,
      token,
      refreshToken
    };
  }
}
