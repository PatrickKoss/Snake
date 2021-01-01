// If global ENV variables are not set, overwrite with defaults
import App from "./App.class";
import router from "./routes";
import {GameField} from "./models/GameField";
import {LeaderboardRestClient} from "./models/LeaderboardRestClient";

process.env.PORT = process.env.PORT || "3000";

// initialize the socket io server
const app = new App(router).express;
let server = require('http').Server(app);
let io = require('socket.io').listen(server);

server.listen(3000);
// const apiEndpoint = "http://127.0.0.1:8000";

// handle the connection to the server
io.on('connection', async function (socket) {
  // define the variables needed for the game
  console.log("connection");
  let directions = [];
  directions.push(0);
  let gameField: GameField = new GameField(directions, 20, 20);
  let gameover = [];
  let handle;
  let gameSpeed = 250;
  let gameFieldSize = 20;
  let gameMode = "Solo";
  let userToken = "";
  // send the entire game field to the frontend
  socket.emit("game-field", gameField);
  console.log("after emit game-field");
  // to optimize the runtime, send only snakes and item for updating the game
  socket.emit("updated-snakes", {snakes: gameField.snakes, item: gameField.item});
  // init the game based on the options which was sent by the frontend
  socket.on('init-game', function () {
    console.log("init game");
    directions = [];
    directions.push(0);
    gameField = new GameField(directions, gameFieldSize, gameFieldSize);
    gameover = [];
    socket.emit("game-field", gameField);
    socket.emit("updated-snakes", {snakes: gameField.snakes, item: gameField.item});
  });

  // when a user connects to the server get his user token for writing his score in the database once the game is over
  socket.on('connected', function (token) {
    console.log("connected");
    userToken = token;
    // in the future you might to release a competitive mode. Then you need to put users in one room. Maybe ...
    socket.join("room");
    socket.to("room").emit("clicked", "here we go");
  });

  // get the start game event from the client. Then init the gamefield again and start the game by constantly updating
  // the gamefield after a period defined by the client.
  socket.on("startGame", function (mode) {
    console.log("start game");
    if (mode) {
      gameMode = mode;
    }
    socket.emit("game-field", gameField);
    handle = setInterval(async () => {
      // TODO make all snakes available
      if (mode === "VsAI") {
        gameover = await gameField.update_snakes_blocked_directions(directions, "VsAI");
      } else if (mode === "AIAlone") {
        gameover = await gameField.update_snakes_blocked_directions(directions, "AIAlone");
      } else {
        gameover = await gameField.update_snakes_blocked_directions(directions);
      }
      socket.emit("updated-snakes", {snakes: gameField.snakes, item: gameField.item});
      // TODO do a correct gameover condition
      // this gameover condition check if one snake is crushed. Works perfectly for vsAI and solo mode.
      if (gameover.indexOf(true) !== -1) {
        clearInterval(handle);
        // send score to the backend rest client for saving the score in the database
        let userScore = await LeaderboardRestClient.createScore({
          score: gameField.snakes[0].blocks.length - 2,
          token: userToken,
          mode: gameMode
        });

        let gameOverResponse = {};
        // if the score was successfully saved return the whole respond including a ranking. But if a user is not
        // logged in then only return his score.
        if (userScore.message.messageType === "success") {
          gameOverResponse = userScore;
        } else {
          gameOverResponse = {message: userScore.message, scores: {score: gameField.snakes[0].blocks.length - 2}}
        }
        console.log(gameOverResponse);
        socket.emit("game-over", gameOverResponse);
      }
    }, gameSpeed);
  });

  // init the gameFieldSize based on values send by the client.
  socket.on("gameFieldSize", function (fieldSize) {
    if (fieldSize === "small") {
      gameFieldSize = 15;
      gameField = new GameField(directions, gameFieldSize, gameFieldSize);
    }
    if (fieldSize === "medium") {
      gameFieldSize = 20;
      gameField = new GameField(directions, gameFieldSize, gameFieldSize);
    }
    if (fieldSize === "large") {
      gameFieldSize = 25;
      gameField = new GameField(directions, gameFieldSize, gameFieldSize);
    }
    socket.emit("game-field", gameField);
  });

  // init the gameSpeed based on values sent by the client.
  socket.on("gameSpeed", function (gameSpeedData) {
    if (gameSpeedData === "slow") {
      gameSpeed = 400;
    }
    if (gameSpeedData === "mediocre") {
      gameSpeed = 250;
    }
    if (gameSpeedData === "fast") {
      gameSpeed = 150;
    }
    socket.emit("game-field", gameField);
  });

  // set up the gamefield for the vs AI mode
  socket.on('vsAI', function (data) {
    console.log("vs ai");
    directions = [];
    directions.push(0);
    directions.push(2);
    gameField = new GameField(directions, gameFieldSize, gameFieldSize);
    socket.emit("game-field", gameField);
    socket.emit("updated-snakes", {snakes: gameField.snakes, item: gameField.item});
  });

  // get the user input
  socket.on('ArrowLeft', function (data) {
    directions[0] = 3;
  });
  socket.on('ArrowRight', function (data) {
    directions[0] = 1;
  });
  socket.on('ArrowUp', function (data) {
    directions[0] = 0;
  });
  socket.on('ArrowDown', function (data) {
    directions[0] = 2;
  });
  // when the client disconnects then clear the interval so that the game will not run in the background.
  socket.on('disconnect', function () {
    console.log("disconnected");
    clearInterval(handle);
  });
});
