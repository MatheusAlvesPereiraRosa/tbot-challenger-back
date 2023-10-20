const socketIo = require('socket.io');

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected.');

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected.');
    });
  });

  // Handle incoming messages from your server (Telegram bot)
  // Broadcast these messages to connected clients
  const broadcastTelegramMessages = (message) => {
    io.emit('message', message);
  };

  return broadcastTelegramMessages;
};