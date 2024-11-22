// socket.js
const { Server } = require("socket.io");

let io;

module.exports = {
  init: (server) => {
    io = new Server(server, {
      cors: {
        origin: "http://localhost:5173",
      },
    });

    io.on("connection", (socket) => {
      // Tham gia vào room dựa trên hotel_owner_id
      socket.on("joinRoom", (ownerId) => {
        const roomName = `owner_${ownerId}`;
        socket.join(roomName);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
