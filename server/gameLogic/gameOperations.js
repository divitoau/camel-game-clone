const { generateCamels, setStartingPositions } = require("./camelLogic");
const gameState = require("./gameState.js");
const { regeneratePlayers } = require("./playerLogic.js");
const manager = require("../sessionManager.js");



const resetGame = (isSamePlayers, io) => {
  console.log("resetting game");
  gameState.reset(isSamePlayers);
  generateCamels();
  setStartingPositions();
  if (isSamePlayers) {
    regeneratePlayers();
    manager.declareTurn(io);
    io.emit("startGameRes", gameState.getBoardState());
  } else {
    manager.clearMaps();
    io.emit("newPlayerRes", [], null);
  }
};

module.exports = {
  resetGame,
};
