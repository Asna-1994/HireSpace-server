import mongoose from 'mongoose';

export type messageStatus = 'sent' | 'delivered' | 'read';

export interface IMessage {
  content: string;
  senderId: mongoose.Types.ObjectId ;
  receiverId: mongoose.Types.ObjectId ;
  createdAt?: Date;
  roomId: string;
  updatedAt?: Date;
  _id?: mongoose.Types.ObjectId ;
  status: messageStatus;


}

