import { Server } from "socket.io";
let users = [];
const SocketHandlerNotify = (req, res) => {
  if (res.socket.server.io) {
    /*  console.log('Socket is already running') */
  } else {
    /*    console.log('Socket is initializing') */
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("joinRoomNotification", (id) => {
        const user = { userId: socket.id, room: id };
        const check = users.every((user) => user.userId !== socket.id);
        if (check) {
          users.push(user);
          socket.join(user.room);
        } else {
          users.map((user) => {
            if (user.userId === socket.id) {
              if (user.room !== id) {
                socket.leave(user.room);
                socket.join(id);
                user.room = id;
              }
            }
          });
        }
      });

      socket.on("newNotification", async (fromName,typeNotification, message, notificationRoom, sendBy) => {
        socket.to(notificationRoom).emit("newNotification", {
            fromName,
          from: socket.id.slice(8),
          typeNotification,
          message,
          sendBy,
        });
      });

      socket.on("disconnect", () => {
       /*  console.log(socket.id + "disconnected"); */
      });
    });
  }
  res.end();
};

export default SocketHandlerNotify;
