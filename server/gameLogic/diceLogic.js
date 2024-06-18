const gameState = require("./gameState");

// chooses a die from what is currently in the pyramid
const selectDie = () => {
  const dieIndex = Math.floor(Math.random() * gameState.diceInPyramid.length);
  const selectedDie = gameState.diceInPyramid[dieIndex];
  gameState.diceInPyramid.splice(dieIndex, 1);
  return selectedDie;
};

// rolls a six sided die
const selectFace = () => {
  return Math.ceil(Math.random() * 6);
};

// limits the roll up to 3 and determines if grey die is black or white
const resolveResult = (die, face) => {
  let color = die;
  let number = face > 3 ? face - 3 : face;
  if (die === "grey") {
    if (gameState.whiteCarryingRacer !== gameState.blackCarryingRacer) {
      color = gameState.whiteCarryingRacer ? "grey-white" : "grey-black";
    } else if (gameState.whiteCarryingBlack !== gameState.blackCarryingWhite) {
      color = gameState.whiteCarryingBlack ? "grey-black" : "grey-white";
    } else {
      color = face > 3 ? "grey-black" : "grey-white";
    }
  }
  gameState.diceOnTents.push({
    color,
    number,
  });
  return { color, number };
};

const rollDie = () => {
  const selectedDie = selectDie();
  const selectedFace = selectFace();
  const result = resolveResult(selectedDie, selectedFace);
  return result;
};

// edits grey dice color to reflect appropriate black or white camel
const identifyCamel = (result) => {
  const camelColor = result.color.startsWith("grey-")
    ? result.color.substring(5)
    : result.color;
  return gameState.allCamels.find((c) => c.color === camelColor);
};

const bopPyramid = () => {
  if (gameState.diceInPyramid.length > 1) {
    result = rollDie();
    const camel = identifyCamel(result);
    camel.move(result.number);
  }
};

module.exports = {
  rollDie,
  selectFace,
  bopPyramid,
};
