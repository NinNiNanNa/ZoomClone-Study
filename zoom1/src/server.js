import express from "express";

const app = express();

// 확장자 지정
app.set("view engine", "pug");
// 폴더 경로 지정
app.set("views", __dirname + "/views");
// => 해당 폴더에서 확장자가 pug인걸 고르겠다는 의미

app.use("/public", express.static(__dirname + "/public"));

// home으로 가면 request, response를 받고 res.render(home으로 렌더)
app.get("/", (req, res) => res.render("home"));
// 유저가 어떤 url로 이동하던지 홈으로 돌려보내는 방법
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// 포트 3000
app.listen(3000, handleListen);
