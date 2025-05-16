import { ISpamReportDTO } from '../../../Application2/dto/Spam/SpamReportDTO';
import { ISpamReport } from '../../../Domain2/entities/SpamReports';
import { STATUS_CODES } from '../../constants/statusCodes';
import { CustomError } from '../../error/customError';


export const normalizeSpam = (data: any): ISpamReportDTO => {
  //   console.log('Received Spam data:', data);
  if (!data || !data._id) {
    throw new CustomError(
      STATUS_CODES.BAD_REQUEST,
      'Invalid data or missing _id in payment'
    );
  }

  return {
    ...data,
    _id: data._id.toString(),
    reportedByUser: data.reportedByUser.toString(),
    companyId: data.companyId.toString(),
  };
};