const pyramidButton = document.getElementById("pyramid-button");
pyramidButton.addEventListener("click", () => bopPyramid());

const displayDie = (result) => {
  const nextTentNumber = 6 - diceInPyramid.length;
  let nextTent = document.getElementById(`tent-${nextTentNumber}`);
  nextTent.className = `dice-tent ${result.color}-die`;
  nextTent.innerHTML = `<p>${result.number}</p>`;
};

const promptResetPyramid = () => {
  const button = document.getElementById("pyramid-button");
  button.innerText = "reload pyramid";
};

const resetTents = () => {
  document.querySelectorAll(".dice-tent").forEach((tent) => {
    tent.className = "dice-tent";
    tent.innerHTML = "<p> </p>";
  });
  const button = document.getElementById("pyramid-button");
  button.innerText = "bop the pyramid";
};

const promptResetGame = () => {
  const button = document.getElementById("pyramid-button");
  button.innerText = "reset game";
};
