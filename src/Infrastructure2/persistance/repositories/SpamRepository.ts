import { ISpamReportDTO } from '../../../Application2/dto/Spam/SpamReportDTO';
import { ISpamReport } from '../../../Domain2/entities/SpamReports';
import { ISpamRepository } from '../../../Domain2/respositories/ISpamRepo';
import { normalizeSpam } from '../../../shared/utils/Normalisation/normalzeSpam';
import { SpamModel } from '../models/SpamModel';




export class SpamRepository implements ISpamRepository {

  async createSpam(spamData: Partial<ISpamReport>): Promise<ISpamReportDTO> {
    const spamReport = new SpamModel(spamData);
    const savedSpam = await spamReport.save();
    return normalizeSpam(savedSpam)
  }


  async getSpamById(spamId: string): Promise<ISpamReportDTO | null> {
    const spam = await SpamModel.findById(spamId);
    return spam ? normalizeSpam(spam) : null;
  }


  async updateSpam(
    id: string,
    spamData: Partial<ISpamReport>
  ): Promise<ISpamReportDTO | null> {
    const updatedSpam = await SpamModel.findByIdAndUpdate(id, spamData, {
      new: true,
      runValidators: true,
    });
    return updatedSpam ? normalizeSpam(updatedSpam) : null;
  }


  async getAllSpamReport(
    filter: object,
    skip = 0,
    limit = 10
  ): Promise<ISpamReportDTO[]> {
    const spamReports = await SpamModel.find(filter)
      .populate('reportedByUser', 'userName email phone')
      .populate(
        'companyId',
        '_id companyName industry email phone address isBlocked'
      )
      .skip(skip)
      .limit(limit);

    return spamReports.map((spam) => normalizeSpam(spam));
  }

  async countTotal(dateQuery: any = {}): Promise<number> {
    return await SpamModel.countDocuments(dateQuery);
  }


  async countSpamReport(filter: object): Promise<number> {
    return await SpamModel.countDocuments(filter);
  }


  async deleteSpam(spamId: string): Promise<ISpamReportDTO| null> {
    const deletedSpam = await SpamModel.findByIdAndUpdate(
      spamId,
      { isDeleted: true },
      { new: true }
    );
    return deletedSpam ? normalizeSpam(deletedSpam) : null;
  }


  async getSpamByCompanyId(companyId: string): Promise<ISpamReportDTO | null> {
    const spam = await SpamModel.findOne({ companyId });
    return spam ? normalizeSpam(spam) : null;
  }
}
