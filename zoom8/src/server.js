import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

// socket.io 연결
wsServer.on("connection", (socket) => {
  // 클라이언트에서 보낸 "join_room" event 받기
  socket.on("join_room", (roomName) => {
    // input값으로 방 참가
    socket.join(roomName);
    // 발신자를 제외한 방에 있는 모든 클라이언트에게 "welcome" event 전송
    socket.to(roomName).emit("welcome");
  });

  // 클라이언트에서 보낸 "offer" event 받기
  socket.on("offer", (offer, roomName) => {
    // 발신자를 제외한 방에 있는 모든 클라이언트에게 "offer" event 전송
    socket.to(roomName).emit("offer", offer);
  });

  // 클라이언트에서 보낸 "answer" event 받기
  socket.on("answer", (answer, roomName) => {
    // 발신자를 제외한 방에 있는 모든 클라이언트에게 "answer" event 전송
    socket.to(roomName).emit("answer", answer);
  });

  // 클라이언트에서 보낸 "ice" event 받기
  socket.on("ice", (ice, roomName) => {
    // 발신자를 제외한 방에 있는 모든 클라이언트에게 "ice" event 전송
    socket.to(roomName).emit("ice", ice);
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
