const dice_button = document.querySelector(".dice_button");

const allDice = ["blue", "yellow", "green", "red", "purple", "grey"];

let diceInPyramid = allDice;

const selectDie = () => {
  const dieIndex = Math.floor(Math.random() * diceInPyramid.length);
  const selectedDie = diceInPyramid[dieIndex];
  diceInPyramid.splice(dieIndex, 1);
  return selectedDie;
};

const selectFace = () => {
  return Math.ceil(Math.random() * 6);
};

const bopPyramid = () => {
  const selectedDie = selectDie();
  const selectedFace = selectFace();
  let color = selectedDie;
  let number = selectedFace > 3 ? selectedFace - 3 : selectedFace;

  if (selectedDie === "grey") {
    color = selectedFace > 3 ? "black" : "white";
  }

  const result = {
    color,
    number,
  };

  console.log(result);
};
