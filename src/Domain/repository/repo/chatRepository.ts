import { Message } from '../../entities/Message'

export interface ChatRepository {
  saveMessage(message: Message): Promise<void>;
  markMessageAsRead(messageId: string): Promise<Message>;
  getMessagesByRoomId(roomId: string): Promise<Message[]>; 
  getRecentChats(userId: string): Promise<Message[]>
  getUnreadMessagesCount(userId: string): Promise<{ roomId: string; count: number }[]>
  getUnreadMessagesByRoom(userId: string, roomId: string): Promise<number>
}
