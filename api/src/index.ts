// If global ENV variables are not set, overwrite with defaults
import {Snake} from "./models/Snake";

process.env.PORT = process.env.PORT || "3000";

import * as expressOasGenerator from "express-oas-generator";
import App from "./App.class";
import router from "./routes";
import axios from "axios";
import {GameField} from "./models/GameField";
import {Point} from "./models/Point";
import {Item} from "./models/Item";

const app = new App(router).express;
let server = require('http').Server(app);
let io = require('socket.io')(server);

server.listen(80);
// const apiEndpoint = "http://127.0.0.1:8000";

io.on('connection', async function (socket) {
  const apiEndpoint = "http://127.0.0.1:8000";
  let counter = 0;
  // axios.get(`${apiEndpoint}/main/game-field`).then(gameField => socket.emit("game-field", gameField.data)).catch(e => console.log(e));
  // let gameField = (await axios.get(`${apiEndpoint}/main/game-field`)).data;
  let snake: Snake = new Snake(10, 18, 0);
  let item: Item = new Item(new Point(10, 2));
  let gameField: GameField = new GameField(item, [snake]);
  let direction = 0;
  let continueGame = true;
  socket.emit("game-field", gameField);
  let handle = setInterval(() => {
    // let allFieldsBlocked = gameField.update_snakes_blocked_directions([snake]);
    // continueGame = snake.update_snake(direction, item);
    // TODO check this continue game stuff and new Item position
    let allFieldsBlocked = gameField.update_snakes_blocked_directions([snake], [direction]);
    socket.emit("game-field", gameField);
    if (!continueGame || allFieldsBlocked) {
      socket.emit("disconnect");
    }
  }, 250);
  // socket.emit("game-field", gameField);
  socket.on('connected', function (data) {
    console.log(data);
    // socket.emit("id", socket.id);
    // joining and emitting messages to a specific room
    socket.join("room");
    socket.to("room").emit("clicked", "here we go");
  });
  socket.on('ArrowLeft', function (data) {
    direction = 3;
  });
  socket.on('ArrowRight', function (data) {
    direction = 1;
  });
  socket.on('ArrowUp', function (data) {
    direction = 0;
  });
  socket.on('ArrowDown', function (data) {
    direction = 2;
  });
  socket.on('disconnect', function () {
    console.log("disconnected");
    clearInterval(handle);
  });
});
