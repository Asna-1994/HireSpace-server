// const setupChatHandlers = (io: Server, socket: any) => {
//     // Join a specific chat room
//     socket.on('joinRoom', (room) => {
//       socket.join(room);
//       console.log(`${socket.id} joined room: ${room}`);
//     });
  
//     // Handle sending and broadcasting messages
//     socket.on('message', ({ room, content }) => {
//       const message = {
//         sender: socket.id,
//         content,
//         timestamp: new Date(),
//       };
  
//       // Emit the message to the room
//       io.to(room).emit('message', message);
  
//       // Save the message to the database (optional)
//       // await Message.create({ sender: socket.id, room, content });
//     });
//   };
  