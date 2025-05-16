import { messageStatus } from "../../../Domain2/entities/Message";



export interface IMessageDTO {
  content: string;
  senderId: string;
  receiverId: string;
  createdAt?: Date;
  roomId: string;
  updatedAt?: Date;
  _id: string;
  status:messageStatus
}
