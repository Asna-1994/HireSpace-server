// const setupReadReceiptsHandlers = (io: Server, socket: any) => {
//     socket.on('messageRead', ({ room, messageId }) => {
//       // Optionally update the message status in the database
//       // await Message.findByIdAndUpdate(messageId, { read: true });
  
//       // Notify others in the room that the message was read
//       socket.to(room).emit('messageRead', { messageId, user: socket.id });
//     });
//   };
  