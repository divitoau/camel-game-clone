const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const indexRouter = require("./index.js");

const gameState = require("./gameLogic/gameState.js");
const { setStartingPositions } = require("./gameLogic/camelLogic");
const { addPlayer, generatePlayers } = require("./gameLogic/playerLogic");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static("public"));
app.use("/", indexRouter);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.emit("fullState", gameState.getGameState());

  socket.on("newPlayer", (newPlayer) => {
    socket.emit("newPlayerRes", addPlayer(newPlayer), gameState.playerNames);
  });

  socket.on("startGame", () => {
    generatePlayers();
    setStartingPositions();
    gameState.resetPyramid()
    socket.emit("startGameRes", gameState.getGameState());
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const port = process.env.PORT || 8080;
server.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
