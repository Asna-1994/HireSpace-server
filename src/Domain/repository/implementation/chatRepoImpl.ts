import { normalizeMessage } from './../../entities/Message';
import { ChatRepository } from '../repo/chatRepository';
import { Message } from '../../entities/Message';
import { MessageModel } from '../../../Infrastructure/models/MessageModel';
import mongoose from 'mongoose';
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';

export class ChatRepositoryImpl implements ChatRepository {
  async saveMessage(message: Message): Promise<void> {
    const messageDocument = new MessageModel({
      content: message.content,
      senderId: message.senderId,
      receiverId: message.receiverId,
      roomId: message.roomId,
      status: message.status,
    });

    await messageDocument.save();
  }

  async markMessageAsRead(messageId: string): Promise<Message> {
    console.log(`Marking message ${messageId} as read`);

    const updatedMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      { status: 'read' },
      { new: true }
    );
    return normalizeMessage(updatedMessage);
  }

  async getMessagesByRoomId(roomId: string): Promise<Message[]> {
    console.log(`Fetching messages for room ${roomId}`);

    const messages = await MessageModel.find({ roomId })
      .sort({ createdAt: 1 })
      .lean();

    return messages.map(normalizeMessage);
  }

  async getRecentChats(userId: string): Promise<any[]> {
    console.log(`Fetching recent chats for user ${userId}`);

    const recentChats = await MessageModel.aggregate([
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(userId) },
            { receiverId: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$roomId',
          latestMessage: { $first: '$$ROOT' },
        },
      },
      {
        $lookup: {
          from: 'usermodels',
          localField: 'latestMessage.senderId',
          foreignField: '_id',
          as: 'senderDetails',
        },
      },
      {
        $lookup: {
          from: 'usermodels',
          localField: 'latestMessage.receiverId',
          foreignField: '_id',
          as: 'receiverDetails',
        },
      },
      {
        $project: {
          _id: 1,
          latestMessage: 1,
          senderDetails: { $arrayElemAt: ['$senderDetails', 0] },
          receiverDetails: { $arrayElemAt: ['$receiverDetails', 0] },
        },
      },
    ]);

    return recentChats.map((chat) => {
      const message = chat.latestMessage;
      const otherUser =
        message.senderId.toString() === userId
          ? chat.receiverDetails
          : chat.senderDetails;

      return {
        roomId: chat._id,
        lastMessage: message.content,
        createdAt: message.createdAt,
        otherUser: {
          _id: otherUser._id,
          userName: otherUser.userName,
          tagLine: otherUser.tagLine,
          profilePhoto: otherUser.profilePhoto,
        },
      };
    });
  }

  async getUnreadMessagesCount(
    userId: string
  ): Promise<{ roomId: string; count: number }[]> {
    try {
      const results = await MessageModel.aggregate([
        {
          $match: {
            receiverId: new mongoose.Types.ObjectId(userId),
            senderId: { $ne: new mongoose.Types.ObjectId(userId) },
            status: 'sent',
          },
        },
        {
          $group: {
            _id: '$roomId',
            count: { $sum: 1 },
            lastMessage: { $last: '$$ROOT' },
          },
        },

        {
          $sort: {
            'lastMessage.createdAt': -1,
          },
        },

        {
          $project: {
            _id: 0,
            roomId: '$_id',
            count: 1,
          },
        },
      ]);

      return results.map((result) => ({
        roomId: result.roomId.toString(),
        count: result.count,
      }));
    } catch (error) {
      console.error('Error getting unread message counts:', error);
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Failed to get unread message counts'
      );
    }
  }

  async getUnreadMessagesByRoom(
    userId: string,
    roomId: string
  ): Promise<number> {
    try {
      const unreadCount = await MessageModel.countDocuments({
        roomId,
        receiverId: userId,
        status: { $ne: 'read' },
      });

      return unreadCount;
    } catch (error) {
      console.error('Error fetching unread messages:', error);
      throw new Error('Failed to fetch unread messages.');
    }
  }
}
