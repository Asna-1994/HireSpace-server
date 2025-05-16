import { IMessageDTO } from "../../Application2/dto/Message/MessageDTO";
import { IMessage } from "../entities/Message";


export interface IChatRepository {
  saveMessage(message: IMessage): Promise<void>;
  markMessageAsRead(messageId: string): Promise<IMessageDTO | null>;
  getMessagesByRoomId(roomId: string): Promise<IMessageDTO[]>;
  getRecentChats(userId: string): Promise<IMessage[]>;
  getUnreadMessagesCount(
    userId: string
  ): Promise<{ roomId: string; count: number }[]>;
  getUnreadMessagesByRoom(userId: string, roomId: string): Promise<number>;
}
