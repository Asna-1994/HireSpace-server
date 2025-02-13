import { ConnectionRequestImpl } from './Domain/repository/implementation/ConnectionRequestRepoImpl';
import { Server, Socket } from 'socket.io';
import { ChatUseCase } from './Application/usecases/chat/chatUseCase';
import { ChatRepositoryImpl } from './Domain/repository/implementation/chatRepoImpl';
import { Message } from './Domain/entities/Message';
import { CustomError } from './shared/error/customError';
import { generateRoomId } from './shared/utils/generateRoomId';
import http from 'http';

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

    // Forward ICE candidates between peers (if using WebRTC directly)
    socket.on('ice-candidate', ({ receiverId, candidate, senderId }) => {
      console.log('Received ICE candidate:', {
        candidate,
        senderId,
        receiverId,
      });
      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('ice-candidate', {
          senderId,
          candidate,
          type: 'ice-candidate',
        });
      }
    });

    socket.on('initiateVideoCall', (data) => {
      console.log('Call initiation received:', data);
      const { roomId, callerId, callerName, receiverId, receiverName } = data;
      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
        // Notify the receiver about an incoming call
        io.to(receiverSocketId).emit('incomingCall', {
          roomId,
          callerId,
          callerName,
        });
      } else {
        console.log(`Receiver ${receiverId} is not online`);
      }
    });

    // Forward video signal data (offer, answer, ICE candidates)
    socket.on('videoSignal', (data) => {
      console.log('Forwarding video signal:', {
        type: data.type,
        callerId: data.callerId,
        receiverId: data.receiverId,
      });
      const receiverSocketId = userSocketMap[data.receiverId];
      if (receiverSocketId) {
        switch (data.type) {
          case 'offer':
          case 'answer':
            io.to(receiverSocketId).emit('videoSignal', {
              type: data.type,
              data: data.data,
              callerId: data.callerId,
              receiverId: data.receiverId,
              roomId: data.roomId,
              userId: data.userId,
            });
            break;
          case 'ice-candidate':
            io.to(receiverSocketId).emit('ice-candidate', {
              candidate: data.data,
              senderId: data.callerId,
            });
            break;
          default:
            console.log(`Unknown video signal type: ${data.type}`);
        }
      } else {
        console.log(`Receiver ${data.receiverId} socket not found`);
      }
    });

    // When the receiver accepts the call
    socket.on('acceptCall', ({ callerId, receiverId, answer }) => {
      console.log('Call accepted:', { callerId, receiverId });
      const callerSocketId = userSocketMap[callerId];
      if (callerSocketId) {
        io.to(callerSocketId).emit('callAccepted', { receiverId, answer });
      }
    });

    // When the receiver rejects the call
    socket.on('rejectCall', ({ callerId, receiverId }) => {
      console.log('Call rejected by receiver', receiverId);
      const callerSocketId = userSocketMap[callerId];
      if (callerSocketId) {
        io.to(callerSocketId).emit('callRejected', { receiverId });
      }
    });

    // Optionally, update call status (e.g., ringing, busy)
    socket.on('callStatus', (data) => {
      console.log('Call status update:', data);
      io.to(data.targetUserId).emit('callStatus', { status: data.status });
    });

    // When a call ends
    socket.on('endCall', ({ roomId, callerId, receiverId }) => {
      console.log('Call ended:', { roomId, callerId, receiverId });
      io.to(roomId).emit('callEnded', { roomId, callerId, receiverId });
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

    socket.on(
      'readMessage',
      async ({ messageId, roomId }: { messageId: string; roomId: string }) => {
        try {
          await chatUseCase.markAsRead(messageId);
          io.to(roomId).emit('messageRead', { messageId });
        } catch (error) {
          handleSocketError(socket, error);
        }
      }
    );

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

    // Add this when a new connection request is sent
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
