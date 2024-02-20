import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// server.js의 socket은 연결된 브라우저를 뜻한다.
/*
function handleConnection(socket) {
  console.log(socket);
}
wss.on("connection", handleConnection);
*/
wss.on("connection", (socket) => {
  // console.log(socket);
  console.log("Connected to Browser ✅");

  // 브라우저 창을 닫으면 발생
  socket.on("close", () => {
    console.log("Disconnected from the Browser ❌");
  });

  // 브라우저로부터 메세지를 받을때 발생
  socket.on("message", (message) => {
    console.log(message.toString());
  });

  // 브라우저에 "hello!!" 메세지 보냄
  socket.send("hello!!");
});

server.listen(3000, handleListen);
