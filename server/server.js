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

const dummyUsers = ["testguy1", "testguy2"];
let dummyUserIndex = 0;
const autoStart = true;

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.emit("fullState", gameState.getGameState());

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  // maintains a consistent client state through socket reconnections
  socket.on("clientId", (clientId) => {
    const player = manager.allMaps.find((p) => p.clientId === clientId);
    if (player) {
      player.socketId = socket.id;
      socket.emit(
        socket.id === manager.getCurrentPlayerSocket()
          ? "yourTurn"
          : "notYourTurn"
      );
    } else if (autoStart) {
      performAutoStart(clientId, socket);
    }
    console.log(manager.allMaps);
  });

  socket.on("newPlayer", (name, clientId) => {
    const playerSockets = manager.allMaps.map((m) => {
      return m.socketId;
    });
    if (playerSockets.includes(socket.id)) {
      socket.emit("newPlayerRes", "there is already a player on this socket");
    } else if (clientId.length !== 8) {
      socket.emit("newPlayerRes", "clientId error");
    } else if (name === "") {
      socket.emit("newPlayerRes", "Player name cannot be empty");
    } else if (gameState.playerNames.includes(name)) {
      socket.emit("newPlayerRes", `${name} is already taken`);
    } else {
      clientMap = manager.createClientMap(name, clientId, socket.id);
      addPlayer(name);
      console.log(manager.allMaps);
      io.emit(
        "newPlayerRes",
        `${name} ${clientMap.isHost ? "is hosting" : "joined"}`,
        gameState.playerNames
      );
      socket.emit("declareHost", clientMap.isHost);
    }
  });

  socket.on("startGame", () => {
    if (manager.checkHost(socket.id)) {
      generatePlayers();
      setStartingPositions();
      gameState.resetPyramid();
      declareTurn();
      io.emit("startGameRes", gameState.getGameState());
    } else {
      socket.emit("permissionDeny");
    }
  });

  socket.on("takePyramidTicket", () => {
    if (checkTurn(socket.id)) {
      if (gameState.diceInPyramid.length > 1) {
        const currentPlayer =
          gameState.allPlayers[gameState.currentPlayerIndex];
        currentPlayer.takePyramidTicket();
        io.emit(
          "takePyramidTicketRes",
          currentPlayer,
          gameState.diceOnTents,
          gameState.allCamels,
          gameState.allPlayers
        );
        // changes button text when 5 dice are displayed
        if (
          gameState.diceInPyramid.length === 1 &&
          gameState.raceOver !== true
        ) {
          endLeg();
          io.emit("endLeg", gameState.getGameState());
        }
      }
      declareTurn();
    } else {
      socket.emit("permissionDeny");
      socket.emit("notYourTurn");
    }
  });
});

const declareTurn = () => {
  const currentPlayerSocket = manager.getCurrentPlayerSocket();
  io.to(currentPlayerSocket).emit("yourTurn");
  io.except(currentPlayerSocket).emit("notYourTurn");
};

const checkTurn = (socketId) => {
  const isTurn = socketId === manager.getCurrentPlayerSocket();
  return isTurn;
};

const performAutoStart = (clientId, socket) => {
  clientMap = manager.createClientMap(
    dummyUsers[dummyUserIndex],
    clientId,
    socket.id
  );
  addPlayer(dummyUsers[dummyUserIndex]);
  console.log(manager.allMaps);
  io.emit(
    "newPlayerRes",
    `${dummyUsers[dummyUserIndex]} ${
      clientMap.isHost ? "is hosting" : "joined"
    }`,
    gameState.playerNames
  );
  socket.emit("declareHost", clientMap.isHost);
  dummyUserIndex += 1;
  if (dummyUserIndex === 2) {
    generatePlayers();
    setStartingPositions();
    gameState.resetPyramid();
    declareTurn();
    io.emit("startGameRes", gameState.getGameState());
  }
};

const port = process.env.PORT || 8080;
server.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
