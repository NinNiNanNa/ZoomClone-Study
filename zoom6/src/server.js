import http from "http";
// Admin UI - Server를 socket.io에서 import
import { Server } from "socket.io";
// Admin UI - instrument import
import { instrument } from "@socket.io/admin-ui";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
// Admin UI - 새로운 socket.io server를 만들어주기 위해 new 키워드 추가
const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(wsServer, {
  auth: false,
  mode: "development",
});

// 서버안에 있는 모든 방의 array
function publicRooms() {
  // wsServer안에 있는 sids, rooms 가져오기
  // const sids = wsServer.sockets.adapter.sids;
  // const rooms = wsServer.sockets.adapter.rooms;
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

// 방안에 사용자수
function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  socket.onAny((event) => {
    console.log(wsServer.sockets.adapter);
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    // 메세지("welcome" event, 닉네임, countRoom())를 하나의 socket에만 전송
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
    // 메세지("room_change" event, publicRooms())를 모든 socket에 전송
    wsServer.sockets.emit("room_change", publicRooms());
  });

  // 연결이 끊어지기 직전
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
    );
  });

  // 연결이 완전히 끊어짐
  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });

  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });

  socket.on("nickname", (nickname) => {
    socket["nickname"] = nickname;
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
