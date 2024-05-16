const allDice = ["blue", "yellow", "green", "red", "purple", "grey"];
let diceInPyramid = [...allDice];

const selectDie = () => {
  const dieIndex = Math.floor(Math.random() * diceInPyramid.length);
  const selectedDie = diceInPyramid[dieIndex];
  diceInPyramid.splice(dieIndex, 1);
  return selectedDie;
};

const selectFace = () => {
  return Math.ceil(Math.random() * 6);
};

const resolveResult = (die, face) => {
  let color = die;
  let number = face > 3 ? face - 3 : face;
  if (die === "grey") {
    color = face > 3 ? "grey-black" : "grey-white";
  }
  return { color, number };
};

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

const bopPyramid = () => {
  if (diceInPyramid.length > 1) {
    if (diceInPyramid.length === 2) {
      promptResetPyramid();
    }
    result = rollDie();
    displayDie(result);
    camelColor = result.color.startsWith("grey-")
      ? result.color.substring(5)
      : result.color;
    console.log(camelColor);
    const camel = allCamels.find((c) => c.color === camelColor);
    camel.move(result.number);
    displayNewPosition(camelColor);
  } else {
    resetPyramid();
  }
};
