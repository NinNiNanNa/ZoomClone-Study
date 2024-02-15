import http from "http";
// import WebSocket from "ws";
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
  // console.log(socket);
  socket.on("enter_room", (roomName, done) => {
    console.log(roomName);
    setTimeout(() => {
      /*
      done함수를 실행하면 back-end에서 
      function backendDone() {
        console.log("backend done");
      }
      이 코드를 실행시키지 않는다.
      즉 back-end에서 front-end의 코드를 실행시키지 않는다.
      이유는 보안 문제가 생길 수 있기때문이다.
      */
      done("hello from the backend");
    }, 10000);
  });
});

// WebSocket을 이용한 코드
/*
const wss = new WebSocket.Server({ httpServer });
const sockets = [];
wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("Connected to Browser ✅");
  socket.on("close", () => {
    console.log("Disconnected from the Browser ❌");
  });
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
        aSocket.send(`${socket.nickname}: ${message.payload}`)
        );
        break;
        case "nickname":
          socket["nickname"] = message.payload;
          break;
        }
      });
    });
    */

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
