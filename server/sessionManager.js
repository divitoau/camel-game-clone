const gameState = require("./gameLogic/gameState.js");

class ClientMap {
  constructor(name, clientId, socketId, isHost) {
    this.name = name;
    this.clientId = clientId;
    this.socketId = socketId;
    this.isHost = isHost;
  }
}

class SessionState {
  constructor() {
    this.allMaps = [];
    this.hostMap = null;
  }

  createClientMap(name, clientId, socketId) {
    const isHost = gameState.playerNames.length < 1;
    const clientMap = new ClientMap(name, clientId, socketId, isHost);
    if (isHost) {
      this.hostMap = clientMap;
    }
    this.allMaps.push(clientMap);
    return clientMap;
  }

  handleClientReconnect(clientId, socket) {
    if (!gameState.raceStarted) {
      const hostName = this.hostMap?.name;
      socket.emit("newPlayerRes", gameState.playerNames, hostName);
    }
    const player = this.allMaps.find((p) => p.clientId === clientId);
    if (player) {
      player.socketId = socket.id;
      if (gameState.raceStarted) {
        const currentPlayerObject = this.getCurrentPlayerSocket();
        socket.emit(
          socket.id === currentPlayerObject.currentSocketId
            ? "yourTurn"
            : "notYourTurn"
        );
        socket.emit("fullState", gameState.getGameState());
      } else {
        socket.emit("yourName", player.name);
      }
    }
  }

  checkHost(socket, callback) {
    if (this.hostMap?.socketId === socket.id) {
      callback();
    } else {
      socket.emit("permissionDeny");
    }
  }

  declareTurn(io) {
    const currentPlayerSocket = this.getCurrentPlayerSocket().currentSocketId;
    io.to(currentPlayerSocket).emit("yourTurn");
    io.except(currentPlayerSocket).emit("notYourTurn");
  }

  getCurrentPlayerSocket() {
    const currentPlayer = gameState.allPlayers[gameState.currentPlayerIndex];
    const currentSocketId = this.allMaps.find(
      (m) => m.name === currentPlayer.name
    ).socketId;
    return { currentSocketId, currentPlayer };
  }

  clearMaps() {
    this.allMaps = [];
    this.hostMap = null;
  }
}

const manager = new SessionState();

module.exports = manager;
