import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { IJobSeekerProfileRepository } from '../../../Domain2/respositories/IJobSeekerProfileRepo';
import { IUserRepository } from '../../../Domain2/respositories/IUserRepository';
import { denormalizeJobSeekerProfile } from '../../../shared/utils/Normalisation/normaliseJobSeekerProfile';


export class CertificateUseCase {
  constructor(
    private jobSeekerProfileRepository: IJobSeekerProfileRepository,
    private userRepository: IUserRepository
  ) {}



  //certificates

  async addCertificates(certificateData: {
    certificateTitle: string;
    description: string;
    issuer: string;
    issuedDate: string;
    certificateUrl: string;
    userId: string;
    certificateId?: string;
  }) {
    const {
      certificateTitle,
      description,
      issuer,
      issuedDate,
      certificateUrl,
      userId,
      certificateId,
    } = certificateData;

    const certificate = {
      certificateTitle,
      description,
      issuer,
      issuedDate,
      certificateUrl,
    };

    let updatedProfile;

    if (certificateId) {
      updatedProfile = await this.jobSeekerProfileRepository.findOneAndUpdate(
        { userId, 'certificates._id': certificateId },
        { $set: { 'certificates.$': { ...certificate, _id: certificateId } } },
        { new: true }
      );
    } else {
      updatedProfile = await this.jobSeekerProfileRepository.findOneAndUpdate(
        { userId },
        { $push: { certificates: certificate } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    if (!updatedProfile) {
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        certificateId
          ? 'Failed to update certificate'
          : 'Failed to add certificate'
      );
    }

    return updatedProfile.certificates;
  }

  //get certificates
  async getAllCertificates(userId: string) {
    try {
      const jobSeekerProfile = await this.jobSeekerProfileRepository.findOne({
        userId: userId,
      });
      if (!jobSeekerProfile) {
        throw new CustomError(
          STATUS_CODES.NOT_FOUND,
         MESSAGES.NO_PROFILE_FOUND
        );
      }

      return jobSeekerProfile.certificates;
    } catch (err) {
      console.log(err);
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error in getting all certificate details'
      );
    }
  }

  //delete certificate
  async deleteCertificateById(userId: string, certificateId: string) {
    try {
      const jobSeekerProfile = await this.jobSeekerProfileRepository.findOne({
        userId: userId,
      });
      if (!jobSeekerProfile) {
        throw new CustomError(
          STATUS_CODES.NOT_FOUND,
        MESSAGES.NO_PROFILE_FOUND
        );
      }

      let certificateIndex;
      if (jobSeekerProfile.certificates) {
        certificateIndex = jobSeekerProfile?.certificates.findIndex(
          (certificate) => certificate._id.toString() === certificateId
        );

        if (certificateIndex === -1) {
          throw new CustomError(
            STATUS_CODES.NOT_FOUND,
            'Certificate with ID not found'
          );
        }

        jobSeekerProfile.certificates.splice(certificateIndex as number, 1);
      }
      const normalizedInput = denormalizeJobSeekerProfile(jobSeekerProfile);
         const updatedProfile = await this.jobSeekerProfileRepository.update(normalizedInput);
      return updatedProfile.certificates;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error in deleting experience details'
      );
    }
  }


}
