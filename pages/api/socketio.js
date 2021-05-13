import { Server } from "socket.io";

const ioHandler = (req, res) => {
  let broadcaster;
  if (!res.socket.server.io) {
    console.log("*First use, starting socket.io");

    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      socket.broadcast.emit("a user connected");
      socket.on("hello", (msg) => {
        socket.emit("hello", "world!");
      });
    });

    io.sockets.on("error", (e) => console.log(e));
    io.sockets.on("connection", (socket) => {
      socket.on("broadcaster", () => {
        broadcaster = socket.id;
        socket.broadcast.emit("broadcaster");
      });
      socket.on("watcher", () => {
        socket.to(broadcaster).emit("watcher", socket.id);
      });
      socket.on("offer", (id, message) => {
        socket.to(id).emit("offer", socket.id, message);
      });
      socket.on("answer", (id, message) => {
        socket.to(id).emit("answer", socket.id, message);
      });
      socket.on("candidate", (id, message) => {
        socket.to(id).emit("candidate", socket.id, message);
      });
      socket.on("disconnect", () => {
        socket.to(broadcaster).emit("disconnectPeer", socket.id);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("socket.io already running");
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
