
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { Types } from 'mongoose';
import { MESSAGES } from '../../../shared/constants/messages';
import { ICompanyRepository } from '../../../Domain2/respositories/ICompanyRepository';
import { IUserRepository } from '../../../Domain2/respositories/IUserRepository';
import { denormalizeCompany } from '../../../shared/utils/Normalisation/normaliseCompany';

export class ManageMembersUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(email: string, companyId: string, userRole: string) {
    if (!email || !companyId) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
        'Please provide Email and companyId'
      );
    }

    const objectIdCompanyId = new Types.ObjectId(companyId);
    const existingCompany = await this.companyRepository.findById(companyId);
    if (!existingCompany) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.COMPANY_NOT_FOUND);
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (!existingUser) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
       MESSAGES.PLEASE_SIGNUP
      );
    }
    const objectIdUserId = new Types.ObjectId(existingUser._id);
    if (existingCompany.isBlocked) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
        MESSAGES.COMPANY_BLOCKED
      );
    }

    if (existingUser.isBlocked) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
       MESSAGES.USER_BLOCKED
      );
    }

    if (
      existingCompany.members.some(
        (member) => member.userId.toString() === objectIdUserId.toString()
      )
    ) {
      throw new CustomError(
        STATUS_CODES.CONFLICT,
        'User is already a member of this company'
      );
    }

    const role = userRole === 'admin' ? 'companyAdmin' : 'companyMember';
    existingUser.companyId = objectIdCompanyId;
    existingUser.userRole = role;

    existingCompany.members.push({ userId: objectIdUserId.toString(), role });

    const updatedUser = await this.userRepository.update(existingUser);
    const denormalized = denormalizeCompany(existingCompany)
    const updatedCompany = await this.companyRepository.update(denormalized);

    return {
      updatedUser,
      updatedCompany,
    };
  }

  //get member details

  async getMemberDetails(companyId: string) {
    try {
      if (!companyId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Please Provide company Id'
        );
      }

      const existingCompany = await this.companyRepository.findById(companyId);
      if (!existingCompany) {
        throw new CustomError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.COMPANY_NOT_FOUND
        );
      }
      const memberObjects = existingCompany.members;
      if (!memberObjects || memberObjects.length === 0) {
        return [];
      }

      console.log(memberObjects);

      const memberIds = memberObjects.map((member) => member.userId);
      console.log('members ids', memberIds);

      const users = await this.userRepository.findMembers(
        { _id: { $in: memberIds } },
        'userName email'
      );

      console.log(users);

      const membersWithRoles = users?.map((user) => {
        const member = memberObjects.find(
          (m) => m.userId?.toString() === user._id.toString()
        );
        return {
          ...user,
          role: member?.role,
        };
      });

      console.log(membersWithRoles);
      return membersWithRoles;
    } catch (err) {
      console.log(err);
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Failed to fetch member details'
      );
    }
  }

  //remove member
  async removeMember(companyId: string, userId: string) {
    if (!userId || !companyId) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
        'Please provide userId and Company ID'
      );
    }

    const objectIdCompanyId = new Types.ObjectId(companyId);
    const existingCompany = await this.companyRepository.findById(companyId);
    if (!existingCompany) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.COMPANY_NOT_FOUND);
    }

    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, MESSAGES.USER_NOT_FOUND);
    }

    const objectIdUserId = new Types.ObjectId(existingUser._id);

    if (existingCompany.isBlocked) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
       MESSAGES.COMPANY_BLOCKED
      );
    }

    const memberIndex = existingCompany.members.findIndex(
      (member) => member.userId.toString() === objectIdUserId.toString()
    );

    if (memberIndex === -1) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
        'The user is not a member of this company'
      );
    }

    existingCompany.members.splice(memberIndex, 1);
    if (existingUser.companyId?.toString() === objectIdCompanyId.toString()) {
      existingUser.companyId = undefined;
    }

    const updatedUser = await this.userRepository.update(existingUser);
        const denormalized = denormalizeCompany(existingCompany)
    const updatedCompany = await this.companyRepository.update(denormalized);

    return {
      updatedUser,
      updatedCompany,
    };
  }
}
