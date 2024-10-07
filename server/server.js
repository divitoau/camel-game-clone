const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const manager = require("./sessionManager.js");
const gameState = require("./gameLogic/gameState.js");
const {
  generateCamels,
  setStartingPositions,
} = require("./gameLogic/camelLogic");
const { generatePlayers } = require("./gameLogic/playerLogic");
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

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (!gameState.raceStarted) {
      manager.removeMap(socket.id, io);
    }
  });

  // maintains a consistent client state through socket reconnections
  socket.on("clientId", (clientId) => {
    manager.handleClientReconnect(clientId, socket);
    if (gameState.raceStarted) {
      sendThisPlayerState(socket.id);
    } else {
      if (autoStart) {
        performAutoStart(clientId, socket);
      }
    }
  });

  socket.on("newPlayer", (name, clientId) => {
    const playerSockets = manager.allMaps.map((m) => m.socketId);
    if (playerSockets.includes(socket.id)) {
      socket.emit("issueEncounter", "there is already a player on this socket");
    } else if (gameState.raceStarted) {
      socket.emit("issueEncounter", "the race has already started");
    } else if (clientId.length !== 8) {
      socket.emit("issueEncounter", "clientId error");
    } else if (!name) {
      socket.emit("issueEncounter", "Player name cannot be empty");
    } else if (manager.getPlayerNames().includes(name)) {
      socket.emit("issueEncounter", `${name} is already taken`);
    } else {
      const clientMap = manager.createClientMap(name, clientId, socket.id);
      const hostName = manager.hostMap.name;
      socket.emit("declareHost", clientMap.isHost);
      io.emit("newPlayerRes", manager.getPlayerNames(), hostName);
      manager.allMaps.forEach((m) => {
        io.to(m.socketId).emit("yourName", m.name);
      });
    }
  });

  socket.on("startGame", () => {
    manager.checkHost(socket, () => {
      startGame();
    });
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
        io.emit("notYourTurn");
        endRace();
      } else if (gameState.diceInPyramid.length === 1) {
        io.emit("notYourTurn");
        endLeg(false);
      } else {
        manager.declareTurn(io);
      }
      sendPlayerStates();
    });
  });

  socket.on("requestSpectatorSpaces", (isCheering) => {
    checkTurn(socket, (currentPlayer) => {
      const prohibitedSpaces = gameState.getProhibitedSpaces();
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
      socket.emit("spectatorTileRes", currentPlayer.spectatorTile, true);
      io.except(socket.id).emit(
        "spectatorTileRes",
        currentPlayer.spectatorTile,
        false
      );
      sendPlayerStates();
      manager.declareTurn(io);
    });
  });

  socket.on("takeBettingTicket", (color) => {
    checkTurn(socket, (currentPlayer) => {
      const betColorArray = gameState.remainingBettingTickets[color];
      if (betColorArray.length > 0) {
        currentPlayer.takeBettingTicket(betColorArray);
        io.emit("updateBettingTickets", gameState.remainingBettingTickets);
        sendPlayerStates();
        manager.declareTurn(io);
      } else {
        socket.emit("issueEncounter", `no ${color} tickets are left`);
      }
    });
  });

  socket.on("placeFinishCard", (color, isWinner) => {
    checkTurn(socket, (currentPlayer) => {
      const finishCard = currentPlayer.finishCards.find(
        (f) => f.color === color
      );
      if (finishCard) {
        currentPlayer.placeFinishCard(finishCard, isWinner);
        io.emit(
          "updateFinishStack",
          isWinner,
          gameState.hideFinishStack(isWinner)
        );
        sendPlayerStates();
        manager.declareTurn(io);
      } else {
        socket.emit(
          "issueEncounter",
          `you have already placed the ${color} finish card`
        );
      }
    });
  });

  socket.on("startNewGame", (isSamePlayers) => {
    manager.checkHost(socket, () => {
      resetGame(isSamePlayers);
      if (isSamePlayers) {
        sendPlayerStates();
      }
    });
  });
});

const startGame = () => {
  const playerNames = manager.getPlayerNames();
  generatePlayers(playerNames);
  generateCamels();
  setStartingPositions();
  gameState.resetPyramid();
  gameState.setRaceStarted(true);
  separateSpectators("startGameRes", (m) => {
    const otherPlayerNames = playerNames.filter((p) => p !== m?.name);
    return [gameState.getGameState(), otherPlayerNames];
  });
  manager.declareTurn(io);
  sendPlayerStates();
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

const separatePlayers = (clientMap) => {
  const playerName = clientMap?.name;
  const cleanedPlayers = gameState.allPlayers.map((p) => ({
    ...p,
    finishCards: p.finishCards?.length || 0,
  }));
  const player =
    gameState.allPlayers.find((p) => p.name === playerName) || null;
  const otherPlayers = cleanedPlayers.filter((p) => p.name !== playerName);
  return [player, otherPlayers];
};

const separateSpectators = (event, callback) => {
  let playerSocketIds = [];
  manager.allMaps.forEach((m) => {
    playerSocketIds.push(m.socketId);
    const [param1, param2, param3, param4] = callback(m);
    io.to(m.socketId).emit(event, param1, param2, param3, param4);
  });
  const [param1, param2, param3, param4] = callback();
  io.except(playerSocketIds).emit(event, param1, param2, param3, param4);
};

const sendPlayerStates = () => {
  separateSpectators("playerStates", (m) => separatePlayers(m));
};

const sendThisPlayerState = (socketId) => {
  const thisMap = manager.allMaps.find((m) => m.socketId === socketId);
  const [player, otherPlayers] = separatePlayers(thisMap);
  io.to(socketId).emit("playerStates", player, otherPlayers);
};

const endLeg = (isFinal) => {
  gameState.resetPyramid();
  gameState.resetBettingTickets();
  const eventName = isFinal ? "finalEndLeg" : "endLeg";
  const currentPlayerSocket = manager.getCurrentPlayerSocket().currentSocketId;
  const bettingTickets = isFinal ? null : gameState.remainingBettingTickets;
  separateSpectators(eventName, (m) => {
    const isCurrent = m?.socketId === currentPlayerSocket;
    return [
      m ? calculateLeg(m.name) : null,
      bettingTickets,
      isCurrent,
      m?.name,
    ];
  });
};

const endRace = () => {
  gameState.setRaceOver(true);
  endLeg(true);
  const winnerCardScores = countFinishCards(true);
  const loserCardScores = countFinishCards(false);
  const allCardScores = winnerCardScores.concat(loserCardScores);
  const rankedPlayers = declarePlayerRanking();
  separateSpectators("endRace", (m) => {
    let totalFinishRewards = m ? 0 : null;
    if (m) {
      allCardScores.forEach((c) => {
        if (c.owner === m.name) {
          totalFinishRewards += c.reward;
        }
      });
    }
    return [
      winnerCardScores,
      loserCardScores,
      totalFinishRewards,
      rankedPlayers,
    ];
  });
  io.to(manager.hostMap.socketId).emit("promptRestart");
};

const resetGame = (isSamePlayers) => {
  console.log("resetting game");
  gameState.reset(isSamePlayers);
  generateCamels();
  setStartingPositions();
  const playerNames = manager.getPlayerNames();
  if (isSamePlayers) {
    gameState.allPlayers.length = 0;
    generatePlayers(playerNames);
    manager.declareTurn(io);
    separateSpectators("startGameRes", (m) => {
      const otherPlayerNames = playerNames.filter((p) => p !== m?.name);
      return [gameState.getGameState(), otherPlayerNames];
    });
  } else {
    manager.clearMaps();
    io.emit("newPlayerRes", [], null);
  }
};

const performAutoStart = (clientId, socket) => {
  clientMap = manager.createClientMap(
    dummyUsers[dummyUserIndex],
    clientId,
    socket.id
  );
  const hostName = manager.hostMap.name;
  io.emit("newPlayerRes", manager.getPlayerNames(), hostName);
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
