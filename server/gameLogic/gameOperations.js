const { setStartingPositions } = require("./camelLogic");
const gameState = require("./gameState.js");
const { regeneratePlayers } = require("./playerLogic.js");

const resetGame = (isSamePlayers) => {
  console.log("resetting game");
  gameState.setRaceOver(false);
  if (isSamePlayers) {
    gameState.resetFinishCards();
    gameState.resetPyramid();
    gameState.setWhiteCarryingRacer(false);
    gameState.setBlackCarryingRacer(false);
    gameState.setWhiteCarryingBlack(false);
    gameState.setBlackCarryingWhite(false);
    regeneratePlayers();
    setStartingPositions();
  } else {
    // ******* figure out what needs to be done here
    gameState.setRaceStarted(false);
  }
};

module.exports = {
  resetGame,
  regeneratePlayers,
};
