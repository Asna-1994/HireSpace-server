import { IMessage } from "../../../Domain2/entities/Message";
import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../error/customError";

export const normalizeMessage = (data: any): IMessage => {
  // console.log('Received company data:', data);
  if (!data || !data._id) {
    throw new CustomError(
      STATUS_CODES.BAD_REQUEST,
      'Invalid data or missing _id'
    );
  }

  return {
    ...data,
    _id: data._id.toString(),
    senderId: data.senderId.toString(),
    receiverId: data.receiverId.toString(),
  };
};