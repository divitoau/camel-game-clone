const { generateCamels, setStartingPositions } = require("./camelLogic");
const gameState = require("./gameState.js");
const { generatePlayers } = require("./playerLogic.js");
const manager = require("../sessionManager.js");

const resetGame = (isSamePlayers, io) => {
  console.log("resetting game");
  // **** think we maybe gotta reset manager in here too
  gameState.reset(isSamePlayers);
  generateCamels();
  setStartingPositions();
  if (isSamePlayers) {
    gameState.allPlayers.length = 0;
    generatePlayers(manager.getPlayerNames());
    manager.declareTurn(io);
    io.emit("startGameRes", gameState.getGameState());
  } else {
    manager.clearMaps();
    io.emit("newPlayerRes", [], null);
  }
};

module.exports = {
  resetGame,
};
