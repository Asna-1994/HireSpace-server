// const setupTypingHandlers = (io: Server, socket: any) => {
//     // Notify others in the room that the user is typing
//     socket.on('typing', (room) => {
//       socket.to(room).emit('typing', { user: socket.id });
//     });
  
//     // Notify others in the room that the user stopped typing
//     socket.on('stopTyping', (room) => {
//       socket.to(room).emit('stopTyping', { user: socket.id });
//     });
//   };
  