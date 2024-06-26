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
const autoStart = true;

/*  ****** make final scoring display modal,
check for cards before taking / placing on server side,
remove option to add player after player has been added */

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  // maintains a consistent client state through socket reconnections
  socket.on("clientId", (clientId) => {
    handleClientReconnect(clientId, socket);
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
    checkTurn(socket, (currentPlayer) => {
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
        io.emit("notYourTurn");
        endLeg(false);
      } else {
        declareTurn();
      }
      sendPlayerStates();
    });
  });

  socket.on("requestSpectatorSpaces", (isCheering) => {
    checkTurn(socket, (currentPlayer) => {
      const prohibitedSpaces = getProhibitedSpaces();
      socket.emit(
        "spectatorSpaces",
        currentPlayer.name,
        prohibitedSpaces,
        isCheering
      );
    });
  });

  socket.on("placeSpectatorTile", (isCheering, spaceNumber) => {
    checkTurn(socket, (currentPlayer) => {
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
    checkTurn(socket, (currentPlayer) => {
      currentPlayer.takeBettingTicket(color);
      io.emit("updateBettingTickets", gameState.remainingBettingTickets);
      sendPlayerStates();
      declareTurn();
    });
  });

  socket.on("getFinishCards", (isWinner) => {
    checkTurn(socket, (currentPlayer) => {
      socket.emit("finishCardsRes", isWinner, currentPlayer.finishCards);
    });
  });

  socket.on("placeFinishCard", (color, isWinner) => {
    checkTurn(socket, (currentPlayer) => {
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

const handleClientReconnect = (clientId, socket) => {
  if (!gameState.raceStarted) {
    const hostName = manager.allMaps.find((m) => m.isHost === true)?.name;
    socket.emit("newPlayerRes", gameState.playerNames, hostName);
  }
  const player = manager.allMaps.find((p) => p.clientId === clientId);
  if (player) {
    player.socketId = socket.id;
    if (gameState.raceStarted) {
      const currentPlayerObject = manager.getCurrentPlayerSocket();
      socket.emit(
        socket.id === currentPlayerObject.currentSocketId
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
};

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
  const currentPlayerSocket = manager.getCurrentPlayerSocket().currentSocketId;
  io.to(currentPlayerSocket).emit("yourTurn");
  io.except(currentPlayerSocket).emit("notYourTurn");
};

const checkTurn = (socket, callback) => {
  const currentPlayerObject = manager.getCurrentPlayerSocket();
  const isTurn = socket.id === currentPlayerObject.currentSocketId;
  if (isTurn) {
    callback(currentPlayerObject.currentPlayer);
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
  const currentPlayerSocket = manager.getCurrentPlayerSocket().currentSocketId;
  gameState.resetPyramid();
  gameState.resetBettingTickets();
  const eventName = isFinal ? "finalEndLeg" : "endLeg";
  const bettingTickets = !isFinal ? gameState.remainingBettingTickets : null;
  manager.allMaps.forEach((m) => {
    const isCurrent = m.socketId === currentPlayerSocket;
    io.to(m.socketId).emit(
      eventName,
      calculateLeg(m.name),
      bettingTickets,
      isCurrent
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
  const hostName = manager.allMaps.find((m) => m.isHost === true).name;
  io.emit("newPlayerRes", gameState.playerNames, hostName);
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
