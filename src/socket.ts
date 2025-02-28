import { ConnectionRequestImpl } from './Domain/repository/implementation/ConnectionRequestRepoImpl';
import { Server, Socket } from 'socket.io';
import { ChatUseCase } from './Application/usecases/chat/chatUseCase';
import { ChatRepositoryImpl } from './Domain/repository/implementation/chatRepoImpl';
import { Message } from './Domain/entities/Message';
import { CustomError } from './shared/error/customError';
import { generateRoomId } from './shared/utils/generateRoomId';
import http from 'http';
import { ConnectionRequestModel } from './Infrastructure/models/ConnectionRequestModel';

interface VideoCallSignal {
  roomId: string;
  callerId: string;
  receiverId: string;
  type: 'offer' | 'answer' | 'ice-candidate';
  data: any;
  userId?: string;
}

interface UserSocketMap {
  [userId: string]: string;
}

interface VideoCallState {
  roomId: string;
  callerId: string;
  receiverId: string;
  status: 'ringing' | 'accepted' | 'rejected' | 'ended';
  timestamp: number;
}

const activeVideoCalls = new Map<string, VideoCallState>();

const userSocketMap: UserSocketMap = {};

const CALL_TIMEOUT = 30000; // 30 seconds timeout for call acceptance

function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timerId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export const initializeSocket = (server: http.Server): Server => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONT_END_URL,
      credentials: true,
    },
    transports: ['websocket'],
  });

  const chatRepository = new ChatRepositoryImpl();
  const chatUseCase = new ChatUseCase(chatRepository);
  const connectionRequestRepo = new ConnectionRequestImpl();

  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('registerUser', (userId) => {
      userSocketMap[userId] = socket.id;
      console.log(`User ${userId} connected with socket ID ${socket.id}`);
    });

    socket.on('join_room', ({ roomId, userId }) => {
      if (!roomId || !userId) {
        console.error('Missing roomId or userId in join_room event');
        return;
      }
      socket.join(roomId);
      socket.join(userId); // Also join a personal room for notifications
      console.log(`User ${userId} joined room ${roomId}`);
      // Notify other users in the room (if desired)
      socket.broadcast.to(roomId).emit('user_joined', { roomId, userId });
    });

    socket.on('signal', (data) => {
      const { roomId, signalData, senderId, receiverId } = data;
      console.log('signal recieved', signalData);
      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('signal', {
          roomId,
          signalData,
          senderId,
        });
      }
      console.log('emittted signal to reciever ');
    });

    // Handle call initiation
    socket.on('initiateVideoCall', (data) => {
      const { roomId, callerId, callerName, receiverId } = data;
      console.log('call initiation recived from', callerName);
      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('incomingCall', {
          roomId,
          callerId,
          callerName,
        });
      }
    });

    // Handle call acceptance
    socket.on('acceptCall', (data) => {
      const { roomId, callerId, receiverId } = data;
      const callerSocketId = userSocketMap[callerId];
      if (callerSocketId) {
        io.to(callerSocketId).emit('callAccepted', { receiverId });
      }
    });

    // Handle call rejection
    socket.on('rejectCall', (data) => {
      const { roomId, callerId, receiverId , receiverName} = data;
      const callerSocketId = userSocketMap[callerId];
      if (callerSocketId) {
        io.to(callerSocketId).emit('callRejected', { roomId, receiverId, receiverName });
      }
    });

    // Handle call ending
    socket.on('endCall', (data) => {
      const { roomId, callerId, receiverId } = data;
      const callerSocketId = userSocketMap[callerId];
      if (callerSocketId) {
        io.to(callerSocketId).emit('callEnded', { roomId, callerId });
      }
      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('callEnded', { roomId, callerId });
      }
    });
    //chats
    socket.on('getRecentChats', async ({ userId }: { userId: string }) => {
      try {
        console.log('Fetching recent chats for user:', userId);
        const recentChats = await chatUseCase.getRecentChats(userId);
        console.log('Found recent chats:', recentChats);
        socket.emit('recentChats', { chats: recentChats });
      } catch (error) {
        handleSocketError(socket, error);
      }
    });

    socket.on(
      'joinChat',
      async ({
        senderId,
        receiverId,
      }: {
        senderId: string;
        receiverId: string;
      }) => {
        if (!senderId || !receiverId) {
          socket.emit('error', {
            message: 'Sender ID and Receiver ID are required',
          });
          return;
        }

        const roomId = generateRoomId(senderId, receiverId);
        try {
          const chatHistory = await chatUseCase.getChatHistory(roomId);
          socket.join(roomId);
          socket.emit('chatHistory', { roomId, chatHistory });
          console.log(`User ${socket.id} joined room ${roomId}`);
        } catch (error) {
          handleSocketError(socket, error);
        }
      }
    );


socket.on('readMessage', async ({ messageId, roomId }) => {
  try {
    await chatUseCase.markAsRead(messageId);
    io.to(roomId).emit('messageRead', { messageId });
    
 
    const userId = Object.keys(userSocketMap).find(
      key => userSocketMap[key] === socket.id
    );
    
    if (userId) {
      const unreadCounts = await chatRepository.getUnreadMessagesCount(userId);
    
 
      const countsByRoomId: Record<string, number> = unreadCounts.reduce(
        (acc: Record<string, number>, { roomId, count }) => {
          acc[roomId] = count;
          return acc;
        },
        {} as Record<string, number>
      );
    
 
      socket.emit('unreadCounts', { counts: countsByRoomId });
    }
    
  } catch (error) {
    handleSocketError(socket, error);
  }
});

    socket.on(
      'getPendingRequestsCount',
      async ({ userId }: { userId: string }) => {
        try {
          const count =
            await connectionRequestRepo.getPendingRequestsCount(userId);
          socket.emit('pendingRequestsCount', { count });
        } catch (error) {
          handleSocketError(socket, error);
        }
      }
    );

    socket.on(
      'newConnectionRequest',
      async ({ toUserId }: { toUserId: string }) => {
        try {
          const pendingRequests =
            await connectionRequestRepo.getPendingRequestsCount(toUserId);
          console.log(pendingRequests);
          io.emit('pendingRequestsCount', {
            userId: toUserId,
            count: pendingRequests,
          });
        } catch (error) {
          handleSocketError(socket, error);
        }
      }
    );

    socket.on('getUnreadCount', async ({ userId }: { userId: string }) => {
      try {
        const unreadCounts =
          await chatRepository.getUnreadMessagesCount(userId);

        const countsByRoomId = unreadCounts.reduce<{
          [roomId: string]: number;
        }>((acc, { roomId, count }) => {
          acc[roomId] = count;
          return acc;
        }, {});

        socket.emit('unreadCounts', { counts: countsByRoomId });
        console.log(countsByRoomId);
      } catch (error) {
        handleSocketError(socket, error);
      }
    });

    socket.on('message', async (data: Message) => {
      try {
        await chatUseCase.sendMessage(data);
        io.to(data.roomId).emit('message', data);

        const unreadCounts = await chatRepository.getUnreadMessagesCount(
          data.receiverId.toString()
        );
        const countsByRoomId = unreadCounts.reduce<{
          [roomId: string]: number;
        }>((acc, { roomId, count }) => {
          acc[roomId] = count;
          return acc;
        }, {});
        io.emit('unreadCounts', { counts: countsByRoomId });
      } catch (error) {
        handleSocketError(socket, error);
      }
    });

    const debouncedTypingNotification = debounce(
      async (data: { userId: string; roomId: string }) => {
        try {
          await chatUseCase.typingNotification(io, data.userId, data.roomId);
        } catch (error) {
          handleSocketError(socket, error);
        }
      },
      500
    );

    socket.on('typing', (data: { userId: string; roomId: string }) => {
      debouncedTypingNotification(data);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      socket.broadcast.emit('disconnected');
      for (const userId in userSocketMap) {
        if (userSocketMap[userId] === socket.id) {
          delete userSocketMap[userId];
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
};

const handleSocketError = (socket: Socket, error: unknown): void => {
  if (error instanceof CustomError) {
    socket.emit('error', { message: error.message });
  } else {
    console.error('Unexpected error:', error);
    socket.emit('error', { message: 'An unexpected error occurred' });
  }
};

export default initializeSocket;
