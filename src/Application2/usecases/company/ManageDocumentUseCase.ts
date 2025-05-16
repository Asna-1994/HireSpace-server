
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { ICompanyRepository } from '../../../Domain2/respositories/ICompanyRepository';
import { FileUploadUseCase } from '../shared/FileUploadUsecase';
import { CustomError } from '../../../shared/error/customError';
import { denormalizeCompany } from '../../../shared/utils/Normalisation/normaliseCompany';

export class ManageDocumentUseCase {
  constructor(
    private fileUploadUseCase: FileUploadUseCase,
    private companyRepository: ICompanyRepository
  ) {}

  //deleting logo
  async deleteDocument(companyId : string){
   
      const company = await this.companyRepository.findById(companyId);
      if (!company || !company.verificationDocument) {
        throw new CustomError(STATUS_CODES.NOT_FOUND,MESSAGES.COMPANY_NOT_FOUND)
      }

      const { publicId } = company.verificationDocument;
      if (!publicId) {
              throw new CustomError(STATUS_CODES.BAD_REQUEST, 'No document to delete')
      }

      await this.fileUploadUseCase.deleteFile(publicId);

      company.verificationDocument = {
        url: '',
        publicId: '',
      };
      const denormalizedData = denormalizeCompany(company)
      const updatedCompany = await this.companyRepository.update(denormalizedData);
      return updatedCompany
    } 
  
}
