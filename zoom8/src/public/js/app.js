const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("camears");

const call = document.getElementById("call");

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;

// 사용 가능한 카메라 장치 출력
async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((devices) => devices.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
      camerasSelect.appendChild(option);
    });
  } catch (error) {
    console.log(error);
  }
}

// 미디어 장치(audio, video) 출력
async function getMedia(deviceId) {
  const initialConstraints = {
    audio: true,
    video: { facingMode: "user" },
  };
  const cameraConstraints = {
    audio: true,
    video: {
      deviceId: {
        exact: deviceId,
      },
    },
  };

  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstraints
    );
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (error) {
    console.log(error);
  }
}

// 음소거 버튼의 텍스트와 상태
function handleMuteClick() {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
}

// 카메라 버튼의 텍스트와 상태
function handleCameraClick() {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!cameraOff) {
    cameraBtn.innerText = "Camera On";
    cameraOff = true;
  } else {
    cameraBtn.innerText = "Camera Off";
    cameraOff = false;
  }
}

// 선택한 카메라 getMedia() 로 전송
async function handleCameraChange() {
  await getMedia(camerasSelect.value);
  if (myPeerConnection) {
    // webRTC 발생 후 선택한 새 장치로 새로 업데이트 된 video track을 받음
    const videoTrack = myStream.getVideoTracks()[0];
    const videoSender = myPeerConnection
      .getSenders()
      .find((sender) => sender.track.kind === "video");
    // console.log(videoSender);
    videoSender.replaceTrack(videoTrack);
  }
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);

// Welcom Form (join a room) //////////////////////////////////////////////////

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

// 방이름 폼 감추고 미디어 출력
async function startMedia() {
  // 방이름 폼 숨기고, 비디오, 카메라와 오디오제어버튼, 카메라목록 보이게 하기
  welcome.hidden = true;
  call.hidden = false;
  // 비디오, 오디오 출력
  await getMedia();
  makeConnection();
}

// 방이름을 서버로 전송
async function handleWelcomeSubmit(e) {
  e.preventDefault();
  const input = welcomeForm.querySelector("input");
  await startMedia();
  // 서버로 "join_room" event 전송
  socket.emit("join_room", input.value);
  roomName = input.value;
  input.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// Socket Code //////////////////////////////////////////////////

// 서버에서 보낸 "welcome" event 받기(Peer A 브라우저에서만 실행)
socket.on("welcome", async () => {
  // console.log("someone joined");
  const offer = await myPeerConnection.createOffer();
  // console.log(offer);
  myPeerConnection.setLocalDescription(offer);
  console.log("sent the offer");
  // Peer B 브라우저에 offer 데이터를 보내기 위해 서버에 "offer" event 전송
  socket.emit("offer", offer, roomName);
});

// 서버에서 보낸 "offer" event 받기(Peer B 브라우저에서만 실행)
socket.on("offer", async (offer) => {
  console.log("received the offer");
  // console.log(offer);
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  // console.log(answer);
  myPeerConnection.setLocalDescription(answer);
  // Peer A 브라우저에 answer 데이터를 보내기 위해 서버에 "answer" event 전송
  socket.emit("answer", answer, roomName);
  console.log("sent the answer");
});

// 서버에서 보낸 "answer" event 받기(Peer A 브라우저에서만 실행)
socket.on("answer", (answer) => {
  console.log("received the answer");
  // console.log(answer);
  myPeerConnection.setRemoteDescription(answer);
});

// 서버에서 보낸 "ice" event 받고 추가하기
socket.on("ice", (ice) => {
  console.log("received candidate");
  myPeerConnection.addIceCandidate(ice);
});

// RTC Code //////////////////////////////////////////////////

function makeConnection() {
  // 양 브라우저 간 peer to peer 연결을 만듦
  myPeerConnection = new RTCPeerConnection({
    // STUN 서버 리스트 추가
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
    ],
  });
  // console.log(myStream.getTracks()); // 사용하고 있는 오디오, 비디오 트랙 출력
  myPeerConnection.addEventListener("icecandidate", handleIce);
  myPeerConnection.addEventListener("addstream", handleAddStream);
  // 양쪽 브라우저에서 myStream.getTracks()으로 얻은 데이터(카메라와 마이크)를 myPeerConnection안에 집어넣음
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}

function handleIce(data) {
  console.log("sent candidate");
  // console.log(data);
  // 서버에 "ice" event 전송
  socket.emit("ice", data.candidate, roomName);
}

function handleAddStream(data) {
  console.log("got an stream from my peer");
  console.log("Peer's Stream", data.stream);
  console.log("My Stream", myStream);
  const peersFace = document.getElementById("peersFace");
  peersFace.srcObject = data.stream;
}
