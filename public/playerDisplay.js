const racerColors = ["blue", "yellow", "green", "red", "purple"];
let isPickingWinner = null;

const actionButtons = document.querySelectorAll("#player-actions button");

const pyramidButton = document.getElementById("pyramid-button");
const finishWinnerButton = document.getElementById("finish-winner-button");
const finishLoserButton = document.getElementById("finish-loser-button");
const finishBetDialog = document.getElementById("finish-bet-dialog");
const finishBetCancelButton = document.getElementById(
  "finish-bet-cancel-button"
);
const spectatorButton = document.getElementById("spectator-button");
const spectatorDialog = document.getElementById("spectator-dialog");
const cheeringButton = document.getElementById("cheering-button");
const booingButton = document.getElementById("booing-button");
const spectatorCancelButton = document.getElementById(
  "spectator-cancel-button"
);
const moneyCount = document.getElementById("money-count");
const pyramidTicketsDisplay = document.getElementById(
  "pyramid-tickets-display"
);
const pyramidTicketsCount = document.getElementById("pyramid-tickets-count");
const spectatorTileDisplay = document.getElementById("spectator-tile-display");
const heldLegBetsContainer = document.getElementById("held-leg-bets-container");
const heldFinishCardsContainer = document.getElementById(
  "held-finish-cards-container"
);

const legBetContainer = document.getElementById("leg-bet-container");

const createBetButtons = (container) => {
  const isLegBet = container === legBetContainer;
  (isLegBet ? racerColors : currentPlayer.finishCards).forEach((f) => {
    const color = isLegBet ? f : f.color;
    const betButton = document.createElement("button");
    betButton.className = `${color}-bet-button bet-button`;
    betButton.textContent = `Bet on ${color} camel`;
    container.appendChild(betButton);
    betButton.addEventListener(
      "click",
      () => {
        if (isLegBet) {
          currentPlayer.takeBettingTicket(color);
        } else {
          currentPlayer.placeFinishCard(color, isPickingWinner);
          finishBetDialog.close();
          removeFinishBetButtons();
          isPickingWinner = null;
        }
      },
      false
    );
  });
};
createBetButtons(legBetContainer);

pyramidButton.addEventListener("click", () => takePyramidTicket());
finishWinnerButton.addEventListener("click", () => handleFinishButton(true));
finishLoserButton.addEventListener("click", () => handleFinishButton(false));
finishBetCancelButton.addEventListener("click", () => {
  finishBetDialog.close();
  removeFinishBetButtons();
  isPickingWinner = null;
});

spectatorButton.addEventListener("click", () => spectatorDialog.showModal());
spectatorCancelButton.addEventListener("click", () => spectatorDialog.close());
cheeringButton.addEventListener("click", () => {
  requestSpectatorSpaces(true);
  spectatorDialog.close();
});
booingButton.addEventListener("click", () => {
  requestSpectatorSpaces(false);
  spectatorDialog.close();
});

const disableActionButtons = () => {
  actionButtons.forEach((b) => {
    b.setAttribute("disabled", "");
  });
};

const enableActionButtons = () => {
  actionButtons.forEach((b) => {
    b.removeAttribute("disabled", "");
  });
};

const updatePlayerDisplay = (player) => {
  moneyCount.innerText = player.money;
  pyramidTicketsCount.innerText = player.pyramidTickets;
  spectatorTileDisplay.innerText =
    player.spectatorTile.position === null ? "spectator tile" : "";
  let bettingTicketsDisplay = " ";
  player.bettingTickets.forEach((b) => {
    bettingTicketsDisplay = bettingTicketsDisplay.concat(
      `<span class="${b.color}">${b.value} </span>`
    );
  });
  heldLegBetsContainer.innerHTML = bettingTicketsDisplay;
  let finishCardsDisplay = " ";
  player.finishCards.forEach((f) => {
    finishCardsDisplay = finishCardsDisplay.concat(
      `<span class="${f.color}">finish </span>`
    );
  });
  heldFinishCardsContainer.innerHTML = finishCardsDisplay;
};

const handleFinishButton = (isWinner) => {
  if (currentPlayer.finishCards.length < 1) {
    console.log("you are out of finish cards");
  } else {
    isPickingWinner = isWinner;
    createBetButtons(finishBetDialog);
    finishBetDialog.showModal();
  }
};

// shows the newly placed spectator tile on DOM
const displaySpectatorTile = (currentPlayerName, isCheering, spaceNumber) => {
  const tile = document.createElement("div");
  tile.id = `${currentPlayerName}-spectator-tile`;
  if (isCheering) {
    tile.className = "spectator-tile cheering-tile";
    tile.innerHTML = `<p>${currentPlayerName}</p> <p>+1</p>`;
  } else {
    tile.className = "spectator-tile booing-tile";
    tile.innerHTML = `<p>${currentPlayerName}</p> <p>-1</p>`;
  }
  const tileSpace = document.getElementById(`track-space-${spaceNumber}`);
  tileSpace.appendChild(tile);
};

// creates buttons on each permitted space where a tile can be placed
const displaySpectatorPlacers = (
  currentPlayerName,
  prohibitedSpaces,
  isCheering
) => {
  oldTile = document.getElementById(`${currentPlayerName}-spectator-tile`);
  if (oldTile) {
    oldTile.remove();
  }

  document.querySelectorAll(".track-space").forEach((s) => {
    const spaceNumber = parseInt(s.id.substring(12));
    if (!prohibitedSpaces.includes(spaceNumber)) {
      const placeButton = document.createElement("button");
      placeButton.className = "place-button";
      placeButton.id = `place-button-${spaceNumber}`;
      placeButton.textContent = `Place ${
        isCheering ? "cheering" : "booing"
      } tile`;
      placeButton.addEventListener("click", () =>
        placeSpectatorTile(isCheering, spaceNumber)
      );
      s.appendChild(placeButton);
    }
  });
};

const removeFinishBetButtons = () => {
  document.querySelectorAll(`#finish-bet-dialog .bet-button`).forEach((b) => {
    b.remove();
  });
};

const removeSpectatorPlacers = () => {
  document.querySelectorAll(".place-button").forEach((b) => {
    b.remove();
  });
};

const resetSpectatorTiles = () => {
  document.querySelectorAll(".spectator-tile").forEach((t) => {
    t.remove();
  });
};
