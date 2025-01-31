import { SpamModel } from "../../../Infrastructure/models/SpamModel";
import { SpamReport, normalizeSpam } from "../../entities/SpamReport";
import { SpamRepository } from "../repo/spamRepository";


export class SpamRepositoryImpl implements SpamRepository {
  // Create a new spam report
  async createSpam(spamData: Partial<SpamReport>): Promise<SpamReport> {
    const spamReport = new SpamModel(spamData);
    const savedSpam = await spamReport.save();
    return normalizeSpam(savedSpam)
  }

  // Get a spam report by its ID
  async getSpamById(spamId: string): Promise<SpamReport | null> {
    const spam = await SpamModel.findById(spamId);
    return spam ?  normalizeSpam(spam) : null;
  }

  // Update a spam report by ID
  async updateSpam(id: string, spamData: Partial<SpamReport>): Promise<SpamReport | null> {
    const updatedSpam = await SpamModel.findByIdAndUpdate(id, spamData, {
      new: true, 
      runValidators: true, 
    });
    return updatedSpam ?  normalizeSpam(updatedSpam) : null;
  }

  // Get all spam reports with filtering, pagination, and sorting
  async getAllSpamReport(
    filter: object,
    skip = 0,
    limit = 10,
  ): Promise<SpamReport[]> {
    const spamReports = await SpamModel.find(filter)
      .populate("reportedByUser", "userName email phone")
      .populate("companyId", "_id companyName industry email phone address isBlocked")
      .skip(skip) 
      .limit(limit);
  
    return spamReports.map((spam) => normalizeSpam(spam));
  }
  

  async countTotal(dateQuery: any = {}): Promise<number> {
    return await SpamModel.countDocuments(dateQuery);
}

  // Count the number of spam reports matching a filter
  async countSpamReport(filter: object): Promise<number> {
    return await SpamModel.countDocuments(filter);
  }

  //delete a spam report by ID
  async deleteSpam(spamId: string): Promise<SpamReport | null> {
    const deletedSpam = await SpamModel.findByIdAndUpdate(
      spamId,
      { isDeleted: true },
      { new: true }
    );
    return deletedSpam ?  normalizeSpam(deletedSpam) : null;
  }

  // Get spam reports
  async getSpamByCompanyId(companyId: string): Promise<SpamReport | null> {
    const spam = await SpamModel.findOne({ companyId });
    return spam ?  normalizeSpam(spam) : null;
  }
}
