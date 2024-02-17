const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("camears");

let myStream; // stream: 비디오 + 오디오
let muted = false; // 소리가 나는 상태
let cameraOff = false; // 카메라가 켜져있는 상태

// 사용 가능한 카메라 장치 출력
async function getCameras() {
  try {
    // 사용 가능한 장치 목록
    const devices = await navigator.mediaDevices.enumerateDevices();
    // console.log(devices);
    // 사용 가능한 장치 목록 중 카메라 목록만
    const cameras = devices.filter((devices) => devices.kind === "videoinput");
    // console.log(cameras);
    // 현재 사용하고 있는 카메라
    const currentCamera = myStream.getVideoTracks()[0];
    // 사용 가능한 카메라 목록 option에 추가
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      // 사용하고 있는 카메라와 선택된 카메라의 label이 같다면 선택된걸로 출력
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
  // initialConstraints : deviceId가 없을때 실행(카메라 목록 만들기 전)
  const initialConstraints = {
    audio: true,
    video: { facingMode: "user" },
  };
  // cameraConstraints : deviceId가 있을때 실행(카메라 목록 만든 후)
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
      // deviceId 가 있다면 cameraConstraints 없다면 initialConstraints
      deviceId ? cameraConstraints : initialConstraints
    );
    /*
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    */
    // console.log(myStream);
    myFace.srcObject = myStream;
    /*
    목록에서 카메라를 선택하면 카메라 목록이 늘어남
    "await getCameras();" 를 if문으로 감싸기
    처음 getMedia()를 실행했을때(!deviceId 인 경우)만 실행
    */
    if (!deviceId) {
      // getCameras() 실행
      await getCameras();
    }
  } catch (error) {
    console.log(error);
  }
}
getMedia();

// 음소거 버튼의 텍스트와 상태
function handleMuteClick() {
  // console.log(myStream.getAudioTracks());
  // 소리 on/off 기능
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
  // console.log(myStream.getVideoTracks());
  // 카메라 on/off 기능
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
  // console.log(camerasSelect.value);
  await getMedia(camerasSelect.value);
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);
