let isPlacingToken = false

const betButtonContainer = document.getElementById("bet-button-container");
allCamels.forEach((camel) => {
  if (camel.color !== "white" && camel.color !== "black") {
    const betButton = document.createElement("button");
    betButton.className = `bet-button`;
    betButton.id = `${camel.color}-bet-button`;
    betButton.textContent = `Bet on ${camel.color} camel`;
    betButtonContainer.appendChild(betButton);
    betButton.addEventListener(
      "click",
      () => currentPlayer.takeBettingTicket(camel.color),
      false
    );
  }
});

const spectatorButton = document.getElementById("spectator-button");
const spectatorDialog = document.getElementById("spectator-dialog");
const cheeringButton = document.getElementById("cheering-button");
const booingButton = document.getElementById("booing-button");
const spectatorCancelButton = document.getElementById(
  "spectator-cancel-button"
);

spectatorButton.addEventListener("click", () => spectatorDialog.showModal());
spectatorCancelButton.addEventListener("click", () => spectatorDialog.close());
