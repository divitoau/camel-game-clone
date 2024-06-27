const gameState = require("./gameLogic/gameState.js");

class ClientMap {
  constructor(name, clientId, socketId, isHost) {
    this.name = name;
    this.clientId = clientId;
    this.socketId = socketId;
    this.isHost = isHost;
  }
}

class MapState {
  constructor() {
    this.allMaps = [];
    this.hostMap;
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

  checkHost(socketId) {
    return this.hostMap?.socketId === socketId;
  }

  getCurrentPlayerSocket() {
    const currentPlayer = gameState.allPlayers[gameState.currentPlayerIndex];
    const currentSocketId = this.allMaps.find(
      (m) => m.name === currentPlayer.name
    ).socketId;
    return { currentSocketId, currentPlayer };
  }
}

const manager = new MapState();

module.exports = manager;
