import { ConnectionRequestImpl } from './Domain/repository/implementation/ConnectionRequestRepoImpl';
import { Server, Socket } from 'socket.io';
import { ChatUseCase } from './Application/usecases/chat/chatUseCase';
import { ChatRepositoryImpl } from './Domain/repository/implementation/chatRepoImpl';
import { Message } from './Domain/entities/Message';
import { CustomError } from './shared/error/customError';
import { generateRoomId } from './shared/utils/generateRoomId';
import http from 'http';
import { ConnectionRequestUseCase } from './Application/usecases/connectionReqeust/connectionRequestUseCase';
import { UserRepositoryImpl } from './Domain/repository/implementation/userRepositoryImpl';

interface VideoCallSignal {
  roomId: string;
  userId: string;
  targetUserId: string;
  type: 'offer' | 'answer' | 'ice-candidate';
  data: any;
}

interface CallInitiation {
  roomId: string;
  callerId: string;
  callerName: string;
  receiverId: string;
}

interface CallResponse {
  roomId: string;
  accepterId: string;
  rejecterId  :string
}


function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
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
      origin: 'http://localhost:5173', 
      credentials: true,
    },
    transports: ['websocket'],
  });

  const chatRepository = new ChatRepositoryImpl();
  const userRepository = new UserRepositoryImpl();
  const chatUseCase = new ChatUseCase(chatRepository);
  const connectionRequestRepo= new ConnectionRequestImpl()
  const connectionUseCase = new ConnectionRequestUseCase(connectionRequestRepo, userRepository)

  const activeCallRooms = new Map<string, Set<string>>();


  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);


socket.on('join_room', ({ roomId, userId }) => {
  if (!roomId || !userId) {
    console.error('Missing roomId or userId in join_room event');
    return;
  }
  socket.join(roomId);
  socket.join(userId); // For direct messages
  console.log(`User ${userId} joined room ${roomId}`);
  socket.broadcast.to(roomId).emit('user_joined',{ roomId, userId})
  // Emit confirmation
  // socket.emit('room_joined', { roomId, userId });
});

// Handle video call initiation


// Handle call acceptance
socket.on('initiateVideoCall', (data: CallInitiation) => {
  console.log('Call initiation received:', data);
  const { roomId, callerId, callerName, receiverId } = data;
  
  // Emit to specific receiver
  io.to(receiverId).emit('incomingCall', {
    roomId,
    callerId,
    callerName
  });
});

socket.on('videoSignal', (data) => {
  console.log('Forwarding video signal:', {
    type: data.type,
    from: data.userId,
    to: data.targetUserId
  });
  
  // Emit to specific user
  io.to(data.targetUserId).emit('videoSignal', {
    type: data.type,
    data: data.data,
    userId: data.userId,
    roomId: data.roomId
  });
});

socket.on('acceptCall', (data) => {
  console.log('Call accepted:', data);
  io.to(data.targetUserId).emit('callAccepted', {
    accepterId: data.accepterId,
    roomId: data.roomId
  });
});

socket.on('rejectCall', (data) => {
  console.log('Call rejected:', data);
  io.to(data.targetUserId).emit('callRejected', {
    rejecterId: data.rejecterId,
    roomId: data.roomId
  });
});





socket.on('endCall', (data) => {
  console.log('Call ended:', data);
  io.to(data.targetUserId).emit('callEnded', {
    userId: data.userId,
    roomId: data.roomId
  });
});

    //chats
    socket.on('getRecentChats', async ({ userId }: { userId: string }) => {
      try {
        const recentChats = await chatUseCase.getRecentChats(userId);
        socket.emit('recentChats', { chats: recentChats });
      } catch (error) {
        handleSocketError(socket, error);
      }
    });


    socket.on('joinChat', async ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
      if (!senderId || !receiverId) {
        socket.emit('error', { message: 'Sender ID and Receiver ID are required' });
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
    });


    


    socket.on('readMessage',async({messageId, roomId}:{messageId : string, roomId : string}) => {
try{
await chatUseCase.markAsRead(messageId)
io.to(roomId).emit('messageRead',{messageId})
}
catch(error){
  handleSocketError(socket, error);
} })


socket.on('getPendingRequestsCount', async ({ userId }: { userId: string }) => {
  try {
    const count = await connectionRequestRepo.getPendingRequestsCount(userId);
    socket.emit('pendingRequestsCount', { count });
  } catch (error) {
    handleSocketError(socket, error);
  }
});

// Add this when a new connection request is sent
socket.on('newConnectionRequest', async ({ toUserId }: { toUserId: string }) => {
  try {
    const pendingRequests = await connectionRequestRepo.getPendingRequestsCount(toUserId);
    console.log(pendingRequests)
    io.emit('pendingRequestsCount', { userId: toUserId, count: pendingRequests });
  } catch (error) {
    handleSocketError(socket, error);
  }
});



socket.on('getUnreadCount', async ({ userId }: { userId: string }) => {
  try {
    const unreadCounts = await chatRepository.getUnreadMessagesCount(userId); 
    
    const countsByRoomId = unreadCounts.reduce<{ [roomId: string]: number }>((acc, { roomId, count }) => {
      acc[roomId] = count;
      return acc;
    }, {}); 

    socket.emit('unreadCounts', { counts: countsByRoomId }); 
    console.log(countsByRoomId)
  } catch (error) {
    handleSocketError(socket, error);
  }
});



    socket.on('message', async (data: Message) => {
      try {
        await chatUseCase.sendMessage(data);
        io.to(data.roomId).emit('message', data);
        
        // Also emit updated unread count to receiver
        const unreadCounts = await chatRepository.getUnreadMessagesCount(data.receiverId.toString());
        const countsByRoomId = unreadCounts.reduce<{ [roomId: string]: number }>((acc, { roomId, count }) => {
          acc[roomId] = count;
          return acc;
        }, {});
        io.emit('unreadCounts', { counts: countsByRoomId });
      } catch (error) {
        handleSocketError(socket, error);
      }
    });


    const debouncedTypingNotification = debounce(async (data: { userId: string; roomId: string }) => {
      try {
        await chatUseCase.typingNotification(io, data.userId, data.roomId);
      } catch (error) {
        handleSocketError(socket, error);
      }
    }, 500);

    socket.on('typing', (data: { userId: string; roomId: string }) => {
      debouncedTypingNotification(data);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
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

