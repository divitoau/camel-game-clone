const pyramidButton = document.getElementById("pyramid-button");
pyramidButton.addEventListener("click", () => takePyramidTicket());

const displayDice = (dice) => {
  dice.forEach((d) => {
    const tentNumber = dice.indexOf(d) + 1;
    let tent = document.getElementById(`tent-${tentNumber}`);
    tent.className = `dice-tent ${d.color}-die`;
    tent.innerHTML = `<p>${d.number}</p>`;
  });
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
