var blackList = ["77.88.99.1", "88.77.99.1"];

const express = require("express");
const app = express();

let broadcaster;
const port = 4000;

const http = require("http");
const server = http.createServer(app);

// var ip =
//   server.req.ip ||
//   server.req.connection.remoteAddress ||
//   server.req.socket.remoteAddress ||
//   server.req.connection.socket.remoteAddress;
// if(blackList.indexOf(ip) > -1)
// {
//     res.end(); // exit if it is a black listed ip
// }

const io = require("socket.io")(server);
app.use(express.static(__dirname + "/public"));
console.log(server.request);
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
server.listen(port, "0.0.0.0", () =>
  console.log(`Server is running on port ${port}`)
);
