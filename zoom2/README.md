# HTTP vs WebSockets

<img src="src/1.png" width="400"/>

> HTTP (HyperText Transfer Protocol)  
> 🔸 클라이언트인 웹브라우저와 웹 서버가 서로 간 소통하기 위한 프로토콜이다.  
> 🔸 클라이언트에서 서버로 Request를 보내면 서버는 클라이언트로 Response를 보내는 방식으로 동작한다.  
> 🔸 Response가 있기 전에 무조건 Request가 있어야한다.  
> 🔸 기본적으로 무상태(Stateless)이므로 상태를 저장하지 않는다.  
> &nbsp;&nbsp;&nbsp;&nbsp; (request와 response과정 뒤에 BackEnd는 유저를 잊어버린다.)

> WebSocket  
> 🔸 하나의 TCP접속에 전이중 통신 채널을 제공하는 컴퓨터 통신 프로토콜이다.  
> 🔸 Socket Connection을 유지한 채로 실시간으로 양방향 통신 혹은 데이터 전송이 가능한 프로토콜이다.  
> 🔸 양방향 통신으로 연결이 이루어지면 클라이언트가 요청하지 않아도 데이터가 저절로 서버로부터 올 수 있다.  
> &nbsp;&nbsp;&nbsp;&nbsp; (즉 HTTP처럼 별도의 요청을 보내지 않아도 데이터를 수신할 수 있다.)  
> 🔸 채팅 어플리케이션, SNS, 구글Docs, LOL 같은 멀티플레이 게임, 화상회의 등에서 사용되고 있다.

### WebSocket이 왜 필요한가?

HTTP 만으로 페이스북 메세지를 구현한다면 주기적으로 서버에 request를 보내서 메세지가 왔는지 체크해야 된다.
