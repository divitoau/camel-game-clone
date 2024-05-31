const gameState = require("./gameLogic/gameState.js");

const allMaps = [];

class PlayerMap {
  constructor(name, playerId, socketId, isHost) {
    this.name = name;
    this.playerId = playerId;
    this.socketId = socketId;
    this.isHost = isHost;
  }
}

const createPlayerMap = (name, playerId, socketId) => {
  const playerMap = new PlayerMap(
    name,
    playerId,
    socketId,
    gameState.playerNames.length < 1 ? true : false
  );
  allMaps.push(playerMap);
  return playerMap;
};

module.exports = { allMaps, PlayerMap, createPlayerMap };
