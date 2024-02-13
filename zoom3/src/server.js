import http from "http";
import WebSocket from "ws";
import express from "express";
import { type } from "os";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  // 연결된 브라우저를 sockets 배열에 저장
  sockets.push(socket);
  console.log("Connected to Browser ✅");

  socket.on("close", () => {
    console.log("Disconnected from the Browser ❌");
  });

  socket.on("message", (message) => {
    // console.log(message.toString());
    // socket.send(message.toString());

    // 각 브라우저를 aSocket으로 표시하고 메세지를 보낸다.
    sockets.forEach((aSocket) => aSocket.send(message.toString()));
  });
});

server.listen(3000, handleListen);
