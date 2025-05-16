
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { IFileUploadService } from '../../../Domain2/services/IFileUploadService';
import { ICompanyRepository } from '../../../Domain2/respositories/ICompanyRepository';
import { HandleFileDTO } from '../../dto/Company/CompanyProfileDTO';
import { MESSAGES } from '../../../shared/constants/messages';
import { ICompanyDTO } from '../../dto/Company/companyDTO';
import { denormalizeCompany } from '../../../shared/utils/Normalisation/normaliseCompany';

export class HandleFileUploadUseCase {
  
  constructor(
    private fileService: IFileUploadService,
    private companyRepository : ICompanyRepository
  ) {}

  async execute(data : HandleFileDTO): Promise<ICompanyDTO> {
    const { filePath, companyId, folder, fieldToUpdate, documentNumber } = data
  const result = await this.fileService.upload(filePath, folder);
  const company = await this.companyRepository.findById(companyId);

  if (!company) {
    throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.COMPANY_NOT_FOUND);
  }

  if (fieldToUpdate === 'companyLogo') {
    company.companyLogo = {
      url: result.url,
      publicId: result.publicId,
    };
  }
  if (fieldToUpdate === 'verificationDocument') {
    company.verificationDocument = {
      url: result.url,
      publicId: result.publicId,
    };
    company.documentNumber = documentNumber;
  }

  const denormalized = denormalizeCompany(company)
  return this.companyRepository.update(denormalized);

  }


}

