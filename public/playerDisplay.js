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
const legBetButton = document.getElementById("leg-bet-button");
const legBetDialog = document.getElementById("leg-bet-dialog");
const legBetCancelButton = document.getElementById("leg-bet-cancel-button");
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

legBetButton.addEventListener("click", () => getBettingTickets());
legBetCancelButton.addEventListener("click", () => {
  legBetDialog.close();
  removeLegBetButtons();
  isPickingWinner = null;
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

// shows the newly placed spectator tile on DOM
const displaySpectatorTile = (currentPlayerName, isCheering, spaceNumber) => {
  oldTile = document.getElementById(`${currentPlayerName}-spectator-tile`);
  if (oldTile) {
    oldTile.remove();
  }
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
  tileSpace?.appendChild(tile);
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

const createBetButtons = (container, ticketArray) => {
  ticketArray.forEach((t) => {
    const color = t.color;
    const betButton = document.createElement("button");
    betButton.className = `${color}-bet-button bet-button`;
    betButton.textContent = `Bet on ${color} camel`;
    container.appendChild(betButton);
    betButton.addEventListener(
      "click",
      () => {
        if (container === legBetDialog) {
          takeBettingTicket(color);
          legBetDialog.close();
          removeLegBetButtons();
        } else if (container === finishBetDialog) {
          placeFinishCard(color, isPickingWinner);
          finishBetDialog.close();
          removeFinishBetButtons();
          isPickingWinner = null;
        }
      },
      false
    );
  });
};

const showBettingDialog = (bettingTickets) => {
  if (Object.values(bettingTickets).every((color) => color.length < 1)) {
    console.log("there are no more betting tickets");
  } else {
    const topBettingTickets = [];
    for (const color in bettingTickets) {
      if (bettingTickets[color].length > 0) {
        topBettingTickets.push(bettingTickets[color][0]);
      }
    }
    createBetButtons(legBetDialog, topBettingTickets);
    legBetDialog.showModal();
  }
};

const showFinishDialog = (isWinner) => {
  if (currentPlayer.finishCards.length < 1) {
    console.log("you are out of finish cards");
  } else {
    isPickingWinner = isWinner;
    createBetButtons(finishBetDialog);
    finishBetDialog.showModal();
  }
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

const removeLegBetButtons = () => {
  document.querySelectorAll(`#leg-bet-dialog .bet-button`).forEach((b) => {
    b.remove();
  });
};
