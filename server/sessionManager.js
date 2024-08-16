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
    const isHost = this.getPlayerNames().length < 1;
    const clientMap = new ClientMap(name, clientId, socketId, isHost);
    if (isHost) {
      this.hostMap = clientMap;
    }
    this.allMaps.push(clientMap);
    return clientMap;
  }

  removeMap(socketId, io) {
    const thisIndex = this.allMaps.findIndex((m) => m.socketId === socketId);
    if (thisIndex !== -1) {
      const isHost = this.allMaps[thisIndex].isHost;
      this.allMaps.splice(thisIndex, 1);
      if (isHost) {
        if (this.allMaps.length > 0) {
          const newHost = this.allMaps[0];
          this.hostMap = newHost;
          newHost.isHost = true;
          io.to(newHost.socketId).emit("declareHost", true);
          io.emit("newPlayerRes", this.getPlayerNames(), newHost.name);
        } else {
          this.hostMap = null;
          io.emit("newPlayerRes", [], null);
        }
      } else {
        io.emit("newPlayerRes", this.getPlayerNames(), this.hostMap.name);
      }
    }
    this.allMaps.forEach((m) => {
      io.to(m.socketId).emit("yourName", m.name);
    });
  }

  handleClientReconnect(clientId, socket) {
    if (!gameState.raceStarted) {
      const hostName = this.hostMap?.name;
      socket.emit("newPlayerRes", this.getPlayerNames(), hostName);
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
    } else {
      // ******* connect this to client end
      socket.emit("spectator");
    }
  }

  getPlayerNames() {
    return this.allMaps.map((m) => m.name);
  }

  getPlayerInfo() {
    return this.allMaps.map((m) => ({
      name: m.name,
      clientId: m.clientId,
    }));
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
