
import mongoose from "mongoose";
import { messageStatus } from "../../Infrastructure/models/MessageModel";
import { CustomError } from "../../shared/error/customError";
import { STATUS_CODES } from "../../shared/constants/statusCodes";

export class Message {
    content: string;
    senderId: mongoose.Types.ObjectId 
    receiverId: mongoose.Types.ObjectId 
    createdAt?: Date;
    roomId: string;
    updatedAt?: Date;
    _id?: mongoose.Types.ObjectId;
    status: messageStatus;

    constructor(data: Partial<Message>) {
        this.content = data.content!;
        this.senderId = data.senderId!;
        this.receiverId = data.receiverId!;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this._id = data._id;
        this.roomId = data.roomId!
        this.status = data.status!;
    }
}

  export const normalizeMessage = (data: any): Message => {
    // console.log('Received company data:', data); 
    if (!data || !data._id) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST,'Invalid data or missing _id');
    }
  
    return {
      ...data,
      _id: data._id.toString(), 
      senderId : data.senderId.toString(),
      receiverId : data.receiverId.toString(),
    };
  };