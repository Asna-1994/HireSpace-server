import { CompanyRepository } from "../../../Domain/repository/repo/companyRepository";
import { STATUS_CODES } from "../../../shared/constants/statusCodes";
import { CustomError } from "../../../shared/error/customError";
import { FileUploadUseCase } from "../../usecases/shared/fileUploadUsecase";

export async function handleFileUploadAndUpdate(
    fileUploadUseCase: FileUploadUseCase,
    repository: CompanyRepository,
    filePath: string,
    companyId: string,
    folder: string,
    fieldToUpdate: "companyLogo" | "verificationDocument",
    documentNumber?: string 
  ) {
    const result = await fileUploadUseCase.execute(filePath, folder);
    const company = await repository.findById(companyId);
  
    if (!company) {
      throw new CustomError(STATUS_CODES.NOT_FOUND,"company not found")
    }
  
    if (fieldToUpdate === "companyLogo") {
    
        company.companyLogo = {
          url: result.url,      
          publicId: result.publicId, 
        };
      } 
      if (fieldToUpdate === "verificationDocument") {
    
        company.verificationDocument = {
            url: result.url,   
            publicId: result.publicId, 
          };
          company.documentNumber = documentNumber
      }
    return repository.update(company);
  }
  