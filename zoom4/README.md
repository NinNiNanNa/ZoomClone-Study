# SocketIO vs WebSockets

[ 공식문서 - socket.io ] <https://socket.io/docs/v4/#what-socketio-is-not>  
[ 참고문서 - socket.io npm ] <https://www.npmjs.com/package/socket.io>

#### WebSocket : 양방향 소통을 위한 프로토콜

#### socket.io : 양방향 통신을 하기 위해 웹소켓 기술을 활용하는 라이브러리

프로토콜? 서로 다른 컴퓨터끼리 소통하기 위한 약속  
※ WebSocket과 socket.io는 자바스크립트와 jQuery의 관계와 비슷한 것 같다.

### WebSocket

- HTML5 웹 표준 기술
- 매우 빠르게 작동하며 통신할때 아주 적은 데이터를 이용
- 이벤트를 단순히 듣고, 보내는 것만 가능

### socket.io

- 표준 기술이 아니며, 라이브러리
- 소켓 연결 실패 시 fallback을 통해 다른 방식으로 알아서 해당 클라이언트와 연결을 시도
- 방 개념을 이용해 일부 클라이언트에게만 데이터를 전송하는 브로드캐스팅(Broadcasting)이 가능

### 어떤걸 써야할까?

- 서버에서 연결된 소켓(사용자)들을 세밀하게 관리해야하는 서비스인 경우에는 Broadcasting 기능이 있는 socket.io를 쓰는게 유지보수 측면에서 휠씬 이점이 많다.
- 가상화폐 거래소 같이 데이터 전송이 많은 경우에는 빠르고 비용이 적은 표준 WebSocket을 이용하는게 바람직하다.

# SocketIO 설치

> npm i socket.io

- src > server.js에 socket.io import한 후 io서버 생성

```javascript
import http from "http";
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

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
```

- socket.io를 설치하면 URL(`/socket.io/socket.io.js`)을 제공해준다.  
  이유는 socket.io가 WebSocket의 부가기능이 아니기 때문이다.
  <img src="src/1.png" width="500"/>
