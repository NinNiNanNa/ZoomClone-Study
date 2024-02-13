// app.js의 socket은 서버로의 연결을 뜻한다.
const socket = new WebSocket(`ws://${window.location.host}`);

// 서버와 연결 되었을때 발생
socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

// 서버로부터 메세지를 받을때 발생
socket.addEventListener("message", (message) => {
  console.log("New message: ", message.data);
});

// 서버로부터 연결이 끊겼을때 발생
socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌");
});

// 서버에 "hello from the browser!" 메세지 보냄
setTimeout(() => {
  socket.send("hello from the browser!");
}, 10000);
