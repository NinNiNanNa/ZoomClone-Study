const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

// 메세지 추가
function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

// 메세지 폼 전송시
function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  // 서버로 "new_message" event, 메세지 값, 방이름, addMessage() 전송
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  socket.emit("nickname", input.value);
}

// 방 개설시
function showRoom() {
  // 방 이름 폼 숨기기
  welcome.hidden = true;
  // 메세지보내기 폼 보이기
  room.hidden = false;
  // 작성한 방이름 출력
  const h3 = room.querySelector("h3");
  h3.innerText = `Room - ${roomName}`;
  // 메세지폼과 닉네임폼
  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");
  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit);
}

// 방이름 폼 전송시
function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  // 작성한 값을 "roomName"으로 셋팅
  roomName = input.value;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

// 서버에서 보낸 "welcome" event 받기
socket.on("welcome", (user) => {
  // 다른 user가 입장시 "닉네임 joined! 🖐😄" 메세지 출력
  addMessage(`${user} joined! 🖐😄`);
});

// 서버에서 보낸 "bye" event 받기
socket.on("bye", (left) => {
  // 다른 user가 방을 떠나면 "닉네임 left... 👋😥" 메세지 출력
  addMessage(`${left} left... 👋😥`);
});

// 서버에서 보낸 "new_message" event 받기
socket.on("new_message", addMessage);
