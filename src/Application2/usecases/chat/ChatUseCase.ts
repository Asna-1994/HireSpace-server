import { Server } from 'socket.io';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { CustomError } from '../../../shared/error/customError';
import { MESSAGES } from '../../../shared/constants/messages';
import { IChatRepository } from '../../../Domain2/respositories/IChatRepository';
import { IMessageDTO } from '../../dto/Message/MessageDTO';
import { IMessage } from '../../../Domain2/entities/Message';

export class ChatUseCase {
  constructor(private chatRepository:IChatRepository) {}

  async sendMessage(message: IMessage): Promise<void> {
    if (
      !message.senderId ||
      !message.receiverId ||
      !message.content ||
      !message.roomId
    ) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, 'Invalid message data');
    }

    try {
      message.status = 'sent';
      await this.chatRepository.saveMessage(message);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'An error occurred while sending the message'
      );
    }
  }

  async markAsRead(messageId: string): Promise<void> {
    if (!messageId) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST,MESSAGES.MSG_ID_REQUIRED );
    }

    try {
      await this.chatRepository.markMessageAsRead(messageId);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'An error occurred while marking the message as read'
      );
    }
  }

  async fetchMessages(roomId: string): Promise<IMessageDTO[]> {
    if (!roomId) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, MESSAGES.ROOM_ID_REQUIRED);
    }

    try {
      return await this.chatRepository.getMessagesByRoomId(roomId);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'An error occurred while fetching messages'
      );
    }
  }

  async typingNotification(
    io: Server,
    userId: string,
    roomId: string
  ): Promise<void> {
    if (!userId || !roomId) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
        'User ID and Room ID are required'
      );
    }

    try {
      io.to(roomId).emit('typing', { userId });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'An error occurred while sending typing notification'
      );
    }
  }

  async getRecentChats(userId: string) {
    if (!userId) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, MESSAGES.USER_ID_REQUIRED);
    }
    return await this.chatRepository.getRecentChats(userId);
  }

  async getUnreadMessageCount(userId: string) {
    if (!userId) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, MESSAGES.USER_ID_REQUIRED);
    }
    return await this.chatRepository.getUnreadMessagesCount(userId);
  }

  async getChatHistory(roomId: string) {
    if (!roomId) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, 'Room ID is required');
    }
    return await this.chatRepository.getMessagesByRoomId(roomId);
  }

  async getUnreadMessagesByRoom(
    userId: string,
    roomId: string
  ): Promise<number> {
    if (!userId || !roomId) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
        'User ID and Room ID are required'
      );
    }

    try {
      return await this.chatRepository.getUnreadMessagesByRoom(userId, roomId);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'An error occurred while fetching unread messages'
      );
    }
  }
}
