const gameState = require("./gameLogic/gameState.js");

const allMaps = [];

class ClientMap {
  constructor(name, clientId, socketId, isHost) {
    this.name = name;
    this.clientId = clientId;
    this.socketId = socketId;
    this.isHost = isHost;
  }
}

const createClientMap = (name, clientId, socketId) => {
  const clientMap = new ClientMap(
    name,
    clientId,
    socketId,
    gameState.playerNames.length < 1 ? true : false
  );
  allMaps.push(clientMap);
  return clientMap;
};

const checkHost = (socketId) => {
  const hostMap = allMaps.find((m) => m.isHost === true);
  return hostMap?.socketId === socketId;
};

module.exports = { allMaps, ClientMap, createClientMap, checkHost };
