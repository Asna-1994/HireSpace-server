import { SpamReport } from '../../entities/SpamReport';

export interface SpamRepository {
  createSpam(planData: Partial<SpamReport>): Promise<SpamReport>;
  getSpamById(spamId: string): Promise<SpamReport | null>;
  updateSpam(
    id: string,
    spamData: Partial<SpamReport>
  ): Promise<SpamReport | null>;
  getAllSpamReport(
    filter: object,
    skip?: number,
    limit?: number
  ): Promise<SpamReport[]>;
  countSpamReport(filter: object): Promise<number>;
  deleteSpam(spamId: string): Promise<SpamReport | null>;
  getSpamByCompanyId(companyId: string): Promise<SpamReport | null>;
  countTotal(dateQuery: any): Promise<number>;
}
