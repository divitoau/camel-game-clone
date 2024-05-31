const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const manager = require("./sessionManager.js");
const gameState = require("./gameLogic/gameState.js");
const { setStartingPositions } = require("./gameLogic/camelLogic");
const { addPlayer, generatePlayers } = require("./gameLogic/playerLogic");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.emit("fullState", gameState.getGameState());

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("playerId", (playerId) => {
    if (playerId) {
      const player = manager.allMaps.find((p) => p.playerId === playerId);
      if (player) {
        player.socketId = socket.id;
      }
    }
    console.log(manager.allMaps);
  });

  socket.on("newPlayer", (name, playerId) => {
    const playerSockets = manager.allMaps.map((m) => {
      return m.socketId;
    });
    if (playerSockets.includes(socket.id)) {
      socket.emit("newPlayerRes", "there is already a player on this socket");
    } else if (playerId.length !== 8) {
      socket.emit("newPlayerRes", "playerId error");
    } else if (name === "") {
      socket.emit("newPlayerRes", "Player name cannot be empty");
    } else if (gameState.playerNames.includes(name)) {
      socket.emit("newPlayerRes", `${name} is already taken`);
    } else {
      playerMap = manager.createPlayerMap(name, playerId, socket.id);
      addPlayer(name);
      console.log(manager.allMaps);
      io.emit(
        "newPlayerRes",
        `${name} ${playerMap.isHost ? "is hosting" : "joined"}`,
        gameState.playerNames
      );
      socket.emit("declareHost", playerMap.isHost);
    }
  });

  socket.on("startGame", () => {
    generatePlayers();
    setStartingPositions();
    gameState.resetPyramid();
    io.emit("startGameRes", gameState.getGameState());
  });

  socket.on("takePyramidTicket", () => {
    if (gameState.diceInPyramid.length > 1) {
      const currentPlayer = gameState.allPlayers[gameState.currentPlayerIndex];
      currentPlayer.takePyramidTicket();
      socket.emit(
        "takePyramidTicketRes",
        currentPlayer,
        gameState.diceOnTents,
        gameState.allCamels,
        gameState.allPlayers
      );
      // changes button text when 5 dice are displayed
      if (gameState.diceInPyramid.length === 1 && gameState.raceOver !== true) {
        endLeg();
        socket.emit("endLeg", gameState.getGameState());
      }
    }
  });
});

const port = process.env.PORT || 8080;
server.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
