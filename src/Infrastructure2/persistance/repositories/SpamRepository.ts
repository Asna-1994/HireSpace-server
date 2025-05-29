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




// async getAllSpamReport(
//   filter: object,
//   skip = 0,
//   limit = 10
// ): Promise<{ spamReports: ISpamReportDTO[]; total: number }> {
//   const [reports, total] = await Promise.all([
//     SpamModel.find(filter)
//       .populate('reportedByUser', 'userName email phone')
//       .populate(
//         'companyId',
//         '_id companyName industry email phone address isBlocked'
//       )
//       .sort({createdAt : -1})
//       .skip(skip)
//       .limit(limit),
//     SpamModel.countDocuments(filter),
//   ]);

//   return {
//     spamReports: reports.map((spam) => normalizeSpam(spam)),
//     total,
//   };
// }

async getAllSpamReport(
  filter: {
    searchTerm?: string;
    date?: string;
  },
  skip = 0,
  limit = 10
): Promise<{ spamReports: ISpamReportDTO[]; total: number }> {
  const { searchTerm, date } = filter;

  const matchStage: any = {};

  // Add date filter
  if (date) {
    matchStage.createdAt = {
      $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
      $lte: new Date(new Date(date).setHours(23, 59, 59, 999)),
    };
  }

  const searchRegex = searchTerm ? new RegExp(searchTerm, 'i') : null;

  const pipeline: any[] = [
    {
      $lookup: {
        from: 'usermodels',
        localField: 'reportedByUser',
        foreignField: '_id',
        as: 'reportedByUser',
      },
    },
    { $unwind: '$reportedByUser' },
    {
      $lookup: {
        from: 'companymodels',
        localField: 'companyId',
        foreignField: '_id',
        as: 'companyId',
      },
    },
    { $unwind: '$companyId' },
    { $match: matchStage },
  ];

  // Search filters
  if (searchRegex) {
    pipeline.push({
      $match: {
        $or: [
          { 'reportedByUser.userName': { $regex: searchRegex } },
          { 'reportedByUser.email': { $regex: searchRegex } },
          { 'reportedByUser.phone': { $regex: searchRegex } },
          { 'companyId.companyName': { $regex: searchRegex } },
          { 'companyId.email': { $regex: searchRegex } },
          { 'companyId.phone': { $regex: searchRegex } },
          { reason: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
        ],
      },
    });
  }

  // Sort and paginate
  pipeline.push(
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit }
  );

  const countPipeline = pipeline.slice(0, pipeline.length - 3); // Before skip, limit, sort
  countPipeline.push({ $count: 'total' });

  const [spamReports, totalResult] = await Promise.all([
    SpamModel.aggregate(pipeline),
    SpamModel.aggregate(countPipeline),
  ]);

  const total = totalResult[0]?.total || 0;
  return {
    spamReports: spamReports,
    total,
  };
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
