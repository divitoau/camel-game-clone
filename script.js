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

const displayDie = (result) => {
  const nextTentNumber = 6 - diceInPyramid.length;
  let nextTent = document.getElementById(`tent-${nextTentNumber}`);
  nextTent.className = `dice-tent ${result.color}-die`;
  nextTent.innerHTML = `<p>${result.number}</p>`;
};

const resetPyramid = () => {
  document.querySelectorAll(".dice-tent").forEach((tent) => {
    tent.className = "dice-tent";
    tent.innerHTML = "";
  });
  diceInPyramid = [...allDice];
};

const bopPyramid = () => {
  if (diceInPyramid.length > 1) {
    const selectedDie = selectDie();
    const selectedFace = selectFace();
    const result = resolveResult(selectedDie, selectedFace);
    displayDie(result);
  } else {
    resetPyramid();
    console.log("pyramid reset");
  }
};
