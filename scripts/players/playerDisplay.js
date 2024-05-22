const betButtonContainer = document.getElementById("bet-button-container");
allCamels.forEach((camel) => {
  const betButton = document.createElement("button");
  betButton.className = `bet-button`;
  betButton.id = `${camel.color}-bet-button`;
  betButton.textContent = `Bet on ${camel.color} camel`;
  betButtonContainer.appendChild(betButton);
});
