import { SpamModel } from '../../../Infrastructure/models/SpamModel';
import { SpamReport, normalizeSpam } from '../../entities/SpamReport';
import { SpamRepository } from '../repo/spamRepository';

export class SpamRepositoryImpl implements SpamRepository {

  async createSpam(spamData: Partial<SpamReport>): Promise<SpamReport> {
    const spamReport = new SpamModel(spamData);
    const savedSpam = await spamReport.save();
    return normalizeSpam(savedSpam);
  }


  async getSpamById(spamId: string): Promise<SpamReport | null> {
    const spam = await SpamModel.findById(spamId);
    return spam ? normalizeSpam(spam) : null;
  }


  async updateSpam(
    id: string,
    spamData: Partial<SpamReport>
  ): Promise<SpamReport | null> {
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
  ): Promise<SpamReport[]> {
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


  async deleteSpam(spamId: string): Promise<SpamReport | null> {
    const deletedSpam = await SpamModel.findByIdAndUpdate(
      spamId,
      { isDeleted: true },
      { new: true }
    );
    return deletedSpam ? normalizeSpam(deletedSpam) : null;
  }


  async getSpamByCompanyId(companyId: string): Promise<SpamReport | null> {
    const spam = await SpamModel.findOne({ companyId });
    return spam ? normalizeSpam(spam) : null;
  }
}
