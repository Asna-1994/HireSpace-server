import { ISpamReportDTO } from "../../Application2/dto/Spam/SpamReportDTO";
import { ISpamReport } from "../entities/SpamReports";


export interface ISpamRepository {
  createSpam(planData: Partial<ISpamReport>): Promise<ISpamReportDTO>;
  getSpamById(spamId: string): Promise<ISpamReportDTO| null>;
  updateSpam(
    id: string,
    spamData: Partial<ISpamReport>
  ): Promise<ISpamReportDTO | null>;
  getAllSpamReport(
    filter: object,
    skip?: number,
    limit?: number
  ): Promise<{ spamReports: ISpamReportDTO[]; total: number }>;
  countSpamReport(filter: object): Promise<number>;
  deleteSpam(spamId: string): Promise<ISpamReportDTO | null>;
  getSpamByCompanyId(companyId: string): Promise<ISpamReportDTO | null>;
  countTotal(dateQuery: any): Promise<number>;
}
