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

const bopPyramid = () => {
  if (diceInPyramid.length > 1) {
    if (diceInPyramid.length === 2) {
      promptResetPyramid();
    }
    const selectedDie = selectDie();
    const selectedFace = selectFace();
    const result = resolveResult(selectedDie, selectedFace);
    displayDie(result);
  } else {
    resetPyramid();
  }
};
