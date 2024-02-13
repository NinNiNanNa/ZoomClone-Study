const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) => {
  // console.log("New message: ", message.data);
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌");
});

/*
function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  console.log(input.value);
}
messageForm.addEventListener("submit", handleSubmit);
*/
messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  // console.log(input.value);
  socket.send(input.value);
  input.value = "";
});

nickForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send({
    type: "nickname",
    payload: input.value,
  });
});
