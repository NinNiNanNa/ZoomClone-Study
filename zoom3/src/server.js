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

const sockets = [];

wss.on("connection", (socket) => {
  // console.log(socket);
  // 연결된 브라우저를 sockets 배열에 저장
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("Connected to Browser ✅");

  socket.on("close", () => {
    console.log("Disconnected from the Browser ❌");
  });

  socket.on("message", (msg) => {
    // console.log(msg.toString());
    // socket.send(msg.toString());

    // String인 msg를 javascript Object로 변환
    const message = JSON.parse(msg);
    // console.log(message, msg.toString());
    // if문 switch문으로 정리
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payload}`)
        );
        break;
      case "nickname":
        // console.log(message.payload);
        socket["nickname"] = message.payload;
        break;
    }
    /*
    if (message.type === "new_message") {
      sockets.forEach((aSocket) => aSocket.send(message.payload));
    } else if (message.type === "nickname") {
      console.log(message.payload);
    }
    */
    // 각 브라우저를 aSocket으로 표시하고 메세지를 보낸다.
    // sockets.forEach((aSocket) => aSocket.send(msg.toString()));
  });
});

server.listen(3000, handleListen);
