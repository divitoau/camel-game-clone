const allDice = ["blue", "yellow", "green", "red", "purple", "grey"];
let diceInPyramid = [...allDice];

// chooses a die from what is currently in the pyramid
const selectDie = () => {
  const dieIndex = Math.floor(Math.random() * diceInPyramid.length);
  const selectedDie = diceInPyramid[dieIndex];
  diceInPyramid.splice(dieIndex, 1);
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
    if (whiteCarryingRacer !== blackCarryingRacer) {
      color = whiteCarryingRacer ? "grey-white" : "grey-black";
    } else if (whiteCarryingBlack !== blackCarryingWhite) {
      color = whiteCarryingBlack ? "grey-black" : "grey-white";
    } else {
      color = face > 3 ? "grey-black" : "grey-white";
    }
  }
  return { color, number };
};

// puts all dice back in pyramid
const resetPyramid = () => {
  resetTents();
  diceInPyramid = [...allDice];
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
  return allCamels.find((c) => c.color === camelColor);
};

const resetGame = () => {
  console.log("resetting game");
  raceOver = false;
  resetPyramid();
  removeCamels();
  setStartingPositions();
  displayCamels();
};

const bopPyramid = () => {
  if (raceOver === true) {
    resetGame();
  } else if (diceInPyramid.length > 1) {
    result = rollDie();
    displayDie(result);
    currentPlayer.takePyramidTicket();
    const camel = identifyCamel(result);
    camel.move(result.number);
    // changes button text when 5 dice are displayed
    if (diceInPyramid.length === 1 && raceOver !== true) {
      endLeg();
      promptResetPyramid();
    }
  } else {
    // pressing button again when 5 dice are displayed reloads them into pyramid
    resetPyramid();
  }
};
