# User Video

#3.0 ~ #3.2  
https://jungseok.tistory.com/68  
https://velog.io/@forest0501/ICE-Candidate-Internet-Connectivity-Establishment

## 사용자로부터 비디오를 가져와 화면에 비디오 표출

### 1. 화면에 비디오 생성

- src > views > home.pug 에 video 생성
- video 속성
  - autoplay(자동재생)
  - playsinline(모바일 기기로 비디오 재생 전체화면으로 재생되는 것을 막아줌)

```javascript
doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title Noom
    link(rel="stylesheet", href="https://unpkg.com/mvp.css")
  body
    header
      h1 Noom
    main
      video#myFace(autoplay,playsinline, width="400", height="400")
    script(src="/socket.io/socket.io.js")
    script(src="/public/js/app.js")
```

### 2. 미디어 장치 정보 가져오기

> ### `navigator.mediaDevices.getUserMedia()`
>
> MediaDevices 인터페이스의 `getUserMedia()` 메서드는 사용자에게 미디어 입력 장치(마이크, 카메라 등) 사용 권한을 요청한다.  
> 요청이 수락되면 미디어 종류의 트랙(비디오 트랙, 오디오 트랙 등)을 포함한 MediaStream을 반환한다.  
> [ 공식문서 - getUserMedia( ) ](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#examples)  
> &nbsp;

- video의 srcObject속성에 `getUserMedia()`를 호출한 값을 넣어준다.

```javascript
const socket = io();

const myFace = document.getElementById("myFace");
// stream: 비디오 + 오디오
let myStream;

async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    console.log(myStream);
    myFace.srcObject = myStream;
  } catch (error) {
    console.log(error);
  }
}

getMedia();
```

<img src="src/1.png" width="500"/>
<img src="src/2.png" width="500"/>

## 마이크, 카메라 제어 버튼

### 1. 화면에 버튼 생성

- src > views > home.pug 에 button 2개 생성
- src > public > js > app.js에 button event 설정

```javascript
doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title Noom
    link(rel="stylesheet", href="https://unpkg.com/mvp.css")
  body
    header
      h1 Noom
    main
      div#myStream
        video#myFace(autoplay,playsinline, width="400", height="400")
        button#mute Mute
        button#camera Camera Off
    script(src="/socket.io/socket.io.js")
    script(src="/public/js/app.js")
```

```javascript
const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");

let myStream; // stream: 비디오 + 오디오
let muted = false; // 소리가 나는 상태
let cameraOff = false; // 카메라가 켜져있는 상태

async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    // console.log(myStream);
    myFace.srcObject = myStream;
  } catch (error) {
    console.log(error);
  }
}

getMedia();

// 음소거 버튼의 텍스트와 상태
function handleMuteClick() {
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
  if (!cameraOff) {
    cameraBtn.innerText = "Camera On";
    cameraOff = true;
  } else {
    cameraBtn.innerText = "Camera Off";
    cameraOff = false;
  }
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
```

### 2. 오디오, 비디오 정보 가져오기
