const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const manager = require("./sessionManager.js");
const gameState = require("./gameLogic/gameState.js");
const { setStartingPositions } = require("./gameLogic/camelLogic");
const { addPlayer, generatePlayers } = require("./gameLogic/playerLogic");
const {
  calculateLeg,
  countFinishCards,
  declarePlayerRanking,
} = require("./gameLogic/scoringLogic.js");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const dummyUsers = ["testguy1", "testguy2"];
let dummyUserIndex = 0;
const autoStart = false;

/*  ****** make final scoring display modal,
make money after leg update when modal closes
check for cards before taking / placing on server side,
prevent actions during endleg timeout */

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  // maintains a consistent client state through socket reconnections
  socket.on("clientId", (clientId) => {
    if (!gameState.raceStarted) {
      const hostName = manager.allMaps.find((m) => m.isHost === true)?.name;
      socket.emit("newPlayerRes", gameState.playerNames, hostName);
    }
    const player = manager.allMaps.find((p) => p.clientId === clientId);
    if (player) {
      player.socketId = socket.id;
      if (gameState.raceStarted) {
        socket.emit(
          socket.id === manager.getCurrentPlayerSocket()
            ? "yourTurn"
            : "notYourTurn"
        );
        sendThisPlayerState(socket.id);
        socket.emit("fullState", gameState.getGameState());
      } else {
        socket.emit("yourName", player.name);
      }
    } else if (autoStart) {
      performAutoStart(clientId, socket);
    }
  });

  socket.on("newPlayer", (name, clientId) => {
    const playerSockets = manager.allMaps.map((m) => m.socketId);
    if (playerSockets.includes(socket.id)) {
      socket.emit("newPlayerFail", "there is already a player on this socket");
    } else if (clientId.length !== 8) {
      socket.emit("newPlayerFail", "clientId error");
      console.log(clientId);
    } else if (!name) {
      socket.emit("newPlayerFail", "Player name cannot be empty");
    } else if (gameState.playerNames.includes(name)) {
      socket.emit("newPlayerFail", `${name} is already taken`);
    } else {
      const clientMap = manager.createClientMap(name, clientId, socket.id);
      const hostName = manager.allMaps.find((m) => m.isHost === true).name;
      addPlayer(name);
      socket.emit("declareHost", clientMap.isHost);
      io.emit("newPlayerRes", gameState.playerNames, hostName);
      manager.allMaps.forEach((m) => {
        io.to(m.socketId).emit("yourName", m.name);
      });
    }
  });

  socket.on("startGame", () => {
    if (manager.checkHost(socket.id)) {
      startGame();
    } else {
      socket.emit("permissionDeny");
    }
  });

  socket.on("takePyramidTicket", () => {
    checkTurn(socket, () => {
      const currentPlayer = gameState.allPlayers[gameState.currentPlayerIndex];
      const isFinished = currentPlayer.takePyramidTicket();
      io.emit(
        "takePyramidTicketRes",
        currentPlayer,
        gameState.diceOnTents,
        gameState.allCamels
      );
      if (isFinished) {
        endRace();
      } else if (gameState.diceInPyramid.length === 1) {
        endLeg(false);
      }
      sendPlayerStates();
      if (!gameState.raceOver) {
        declareTurn();
      }
    });
  });

  socket.on("requestSpectatorSpaces", (isCheering) => {
    checkTurn(socket, () => {
      const prohibitedSpaces = getProhibitedSpaces();
      const currentPlayer = gameState.allPlayers[gameState.currentPlayerIndex];
      socket.emit(
        "spectatorSpaces",
        currentPlayer.name,
        prohibitedSpaces,
        isCheering
      );
    });
  });

  socket.on("placeSpectatorTile", (isCheering, spaceNumber) => {
    checkTurn(socket, () => {
      const currentPlayer = gameState.allPlayers[gameState.currentPlayerIndex];
      currentPlayer.placeSpectatorTile(isCheering, spaceNumber);
      io.emit("spectatorTileRes", currentPlayer.name, isCheering, spaceNumber);
      sendThisPlayerState(socket.id);
      declareTurn();
    });
  });

  socket.on("getBettingTickets", () => {
    socket.emit("bettingTicketsRes", gameState.remainingBettingTickets);
  });

  socket.on("takeBettingTicket", (color) => {
    checkTurn(socket, () => {
      const currentPlayer = gameState.allPlayers[gameState.currentPlayerIndex];
      currentPlayer.takeBettingTicket(color);
      io.emit("updateBettingTickets", gameState.remainingBettingTickets);
      sendPlayerStates();
      declareTurn();
    });
  });

  socket.on("getFinishCards", (isWinner) => {
    checkTurn(socket, () => {
      const currentPlayer = gameState.allPlayers[gameState.currentPlayerIndex];
      socket.emit("finishCardsRes", isWinner, currentPlayer.finishCards);
    });
  });

  socket.on("placeFinishCard", (color, isWinner) => {
    checkTurn(socket, () => {
      const currentPlayer = gameState.allPlayers[gameState.currentPlayerIndex];
      currentPlayer.placeFinishCard(color, isWinner);
      io.emit(
        "updateFinishStack",
        isWinner,
        gameState.hideFinishStack(isWinner)
      );
      sendPlayerStates();
      declareTurn();
    });
  });
});

const startGame = () => {
  generatePlayers();
  setStartingPositions();
  gameState.resetPyramid();
  gameState.setRaceStarted(true);
  declareTurn();
  io.emit("startGameRes", gameState.getGameState());
  sendPlayerStates();
};

const declareTurn = () => {
  const currentPlayerSocket = manager.getCurrentPlayerSocket();
  io.to(currentPlayerSocket).emit("yourTurn");
  io.except(currentPlayerSocket).emit("notYourTurn");
};

const checkTurn = (socket, callback) => {
  const isTurn = socket.id === manager.getCurrentPlayerSocket();
  if (isTurn) {
    callback();
  } else {
    socket.emit("permissionDeny");
    socket.emit("notYourTurn");
  }
};

const sendPlayerStates = () => {
  manager.allMaps.forEach((m) => {
    const player = gameState.allPlayers.find((p) => p.name === m.name);
    io.to(m.socketId).emit("yourPlayerState", player);
  });
};

const sendThisPlayerState = (socketId) => {
  const thisMap = manager.allMaps.find((m) => m.socketId === socketId);
  const thisPlayer = gameState.allPlayers.find((p) => p.name === thisMap.name);
  io.to(socketId).emit("yourPlayerState", thisPlayer);
};

const getProhibitedSpaces = () => {
  const prohibitedSpaces = new Set([1]);
  gameState.allCamels.forEach((c) => {
    prohibitedSpaces.add(c.position);
  });
  const currentPlayer = gameState.allPlayers[gameState.currentPlayerIndex];
  gameState.allPlayers.forEach((p) => {
    if (p !== currentPlayer) {
      prohibitedSpaces.add(p.spectatorTile.position);
      prohibitedSpaces.add(p.spectatorTile.position + 1);
      prohibitedSpaces.add(p.spectatorTile.position - 1);
    }
  });
  return Array.from(prohibitedSpaces);
};

const endLeg = (isFinal) => {
  gameState.resetPyramid();
  gameState.resetBettingTickets();
  manager.allMaps.forEach((m) => {
    io.to(m.socketId).emit(
      isFinal ? "finalEndLeg" : "endLeg",
      calculateLeg(m.name),
      !isFinal ? gameState.remainingBettingTickets : null
    );
  });
};

const endRace = () => {
  gameState.setRaceOver(true);
  endLeg(true);
  const winnerCardScores = countFinishCards(true);
  const loserCardScores = countFinishCards(false);
  const allCardScores = winnerCardScores.concat(loserCardScores);
  const rankedPlayers = declarePlayerRanking();
  manager.allMaps.forEach((m) => {
    let totalFinishRewards = 0;
    allCardScores.forEach((c) => {
      if (c.owner === m.name) {
        totalFinishRewards += c.reward;
      }
    });
    io.to(m.socketId).emit(
      "endRace",
      winnerCardScores,
      loserCardScores,
      totalFinishRewards,
      rankedPlayers
    );
  });
};

const performAutoStart = (clientId, socket) => {
  clientMap = manager.createClientMap(
    dummyUsers[dummyUserIndex],
    clientId,
    socket.id
  );
  addPlayer(dummyUsers[dummyUserIndex]);
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
    startGame();
  }
};

const port = process.env.PORT || 8080;
server.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
