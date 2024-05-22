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
      () => player1.takeBettingTicket(camel.color),
      false
    );
  }
});
