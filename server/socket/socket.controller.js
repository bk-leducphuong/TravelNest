const { logger } = require('../config/logger.config');
// src/socket/socketController.js
exports.handleConnection = (io, socket) => {
  logger.info(`User ${socket.user.id} connected`);

  // Tham gia vào room dựa trên hotel_owner_id
  socket.on('joinAdminRoom', (ownerId) => {
    const roomName = `owner_${ownerId}`;
    socket.join(roomName);
  });

  socket.on('joinUserRoom', (userId) => {
    const roomName = `user_${userId}`;
    socket.join(roomName);
  });

  socket.on('disconnect', () => {
    logger.info('Client disconnected:', socket.id);
  });
};
