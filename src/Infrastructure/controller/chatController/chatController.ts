import { Request, Response, NextFunction } from 'express';
import { ChatUseCase } from '../../../Application/usecases/chat/chatUseCase';
import { ChatRepositoryImpl } from '../../../Domain/repository/implementation/chatRepoImpl';
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';


const chatUseCase = new ChatUseCase(new ChatRepositoryImpl());

export const chatController = {
    
  async getRecentChats(req: Request, res: Response, next: NextFunction) {
    const userId = req.query.userId as string;

    if (!userId) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, 'User ID is required' );
    }

    try {
      const chats = await chatUseCase.getRecentChats(userId);
      res.status(STATUS_CODES.SUCCESS).json({
        success : true,
        message: MESSAGES.DATA_FETCHED,
        data: {
           chats
        },
      });
    } catch (error) {
        next(error)
      console.error('Error fetching recent chats:', error);
 
    }
  },

  async getChatHistory(req: Request, res: Response, next: NextFunction) {
    const { roomId } = req.params;

    if (!roomId) {
        throw new CustomError(STATUS_CODES.BAD_REQUEST, 'Room ID is required' );
    }

    try {
      const messages = await chatUseCase.getChatHistory(roomId);
      res.status(STATUS_CODES.SUCCESS).json({
        success : true,
        message: MESSAGES.DATA_FETCHED,
        data: {
           messages
        },
      });
    
    } catch (error) {
      console.error('Error fetching chat history:', error);
      next(error)
    }
  }
};
