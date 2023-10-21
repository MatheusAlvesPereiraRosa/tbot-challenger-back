const socketIo = require('socket.io');

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected.');

    // Lidando com a disconexão
    socket.on('disconnect', () => {
      console.log('A user disconnected.');
    });
  });

  // Lidando com mensagens que chegam do bot do telegram
  // Função para transmitir mensagens que chegam
  const broadcastTelegramMessages = (message) => {
    io.emit('message', message);
  };

  return broadcastTelegramMessages;
};