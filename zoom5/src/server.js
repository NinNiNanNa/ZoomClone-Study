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

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`); // 결과 -  Socket Event: enter_room
  });
  socket.on("enter_room", (roomName, done) => {
    // console.log(socket.id);  // 결과 - i1i22Ser8asv1Y8KAAAD
    // console.log(socket.rooms);  // 결과 - Set(1) { 'i1i22Ser8asv1Y8KAAAD' }

    // 방 개설
    socket.join(roomName);
    // console.log(socket.rooms);  // 결과 - Set(2) { 'i1i22Ser8asv1Y8KAAAD', '1212' }

    // front-end에 showRoom() 실행
    done();

    // 방에 있는 모든 user에게 "welcome" event 전송
    socket.to(roomName).emit("welcome", socket.nickname);
  });

  // 연결이 끊어지기 직전에 "bye" event 전송
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname)
    );
  });

  // front-end에서 전송한 "new_message" event, 메세지 값, 방이름, addMessage() 받기
  socket.on("new_message", (msg, room, done) => {
    // 방에 있는 모든 user에게 "new_message" event, 메세지값 전송
    // socket.to(room).emit("new_message", msg);
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    // front-end에 addMessage() 실행
    done();
  });

  // front-end에서 전송한 "nickname" event, 닉네임 값 받기
  socket.on("nickname", (nickname) => {
    socket["nickname"] = nickname;
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
