// socket.js
const { Server } = require('socket.io');
const { logger } = require('../config/logger.config');
const { handleConnection } = require('./socket.controller');
const {
  sessionSocketMiddleware,
  authMiddleware,
} = require('./socket.middleware');

let io;

module.exports = {
  initSocket: (server) => {
    io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_HOST || '*',
        methods: ['GET', 'POST'],
      },
      connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
      },
    });
    io.on('connection', (socket) => handleConnection(io, socket));

    io.use(sessionSocketMiddleware);
    io.use(authMiddleware);

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },
};
