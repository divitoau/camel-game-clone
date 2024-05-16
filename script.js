const dice_button = document.querySelector(".dice_button");

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
    color = face > 3 ? "grey_black" : "grey_white";
  }
  const result = {
    color,
    number,
  };
  return result;
};

const displayDie = (result) => {
  const nextTentNumber = 6 - diceInPyramid.length;
  let nextTent = document.getElementById(`tent_${nextTentNumber}`);
  nextTent.classList.add(`${result.color}_die`);
  nextTent.innerText = result.number;
};

const resetPyramid = () => {
  let allTents = document.querySelectorAll(".dice_tent");
  allTents.forEach((tent) => {
    tent.classList.remove(
      "blue_die",
      "yellow_die",
      "green_die",
      "red_die",
      "purple_die",
      "grey_black_die",
      "grey_white_die"
    );
    tent.innerText = "";
  });
  diceInPyramid = [...allDice];
};

const bopPyramid = () => {
  if (diceInPyramid.length > 1) {
    const selectedDie = selectDie();
    const selectedFace = selectFace();
    const result = resolveResult(selectedDie, selectedFace);
    console.log(result);
    displayDie(result);
  } else {
    resetPyramid();
    console.log("pyramid reset");
  }
};
