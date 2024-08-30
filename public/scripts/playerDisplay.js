const actionButtons = document.querySelectorAll("#player-interface button");

const pyramidButton = document.getElementById("pyramid-button");

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

const finishWinnerButton = document.getElementById("finish-winner-button");
const finishLoserButton = document.getElementById("finish-loser-button");
const finishBetDialog = document.getElementById("finish-bet-dialog");
const finishBetCancelButton = document.getElementById(
  "finish-bet-cancel-button"
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

pyramidButton.addEventListener("click", () => takePyramidTicket());

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
  removeAllElements("#leg-bet-dialog .bet-button");
});

finishWinnerButton.addEventListener("click", () => getFinishCards(true));
finishLoserButton.addEventListener("click", () => getFinishCards(false));
finishBetCancelButton.addEventListener("click", () => {
  finishBetDialog.close();
  removeAllElements("#finish-bet-dialog .bet-button");
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
      `
      <div class="game-card finish-card">
          <p class="card-player">${player.name}</p>
          <img
            class="card-camel ${f.color}-card-camel"
            src="images/camel.svg"
            alt="a camel"
          />
        </div>`
    );
  });
  heldFinishCardsContainer.innerHTML = finishCardsDisplay;
};

// shows the newly placed spectator tile on DOM
const displaySpectatorTile = (tile) => {
  checkAndRemove(`${tile.player}-spectator-tile`);
  const tileElement = document.createElement("div");
  tileElement.id = `${tile.player}-spectator-tile`;
  tileElement.className = `spectator-tile ${
    tile.isCheering ? "cheering" : "booing"
  }-tile`;
  tileElement.innerHTML = `<p>${tile.player}</p> <p>${
    tile.isCheering ? "+" : "-"
  }1</p>`;

  const tileSpace = document.getElementById(`track-space-${tile.position}`);
  tileSpace?.appendChild(tileElement);
};

// creates buttons on each permitted space where a tile can be placed
const displaySpectatorPlacers = (
  currentPlayerName,
  prohibitedSpaces,
  isCheering
) => {
  checkAndRemove(`${currentPlayerName}-spectator-tile`);
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

const createBetButtons = (container, ticketArray, isWinner) => {
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
          removeAllElements("#leg-bet-dialog .bet-button");
        } else if (container === finishBetDialog) {
          placeFinishCard(color, isWinner);
          finishBetDialog.close();
          removeAllElements("#finish-bet-dialog .bet-button");
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

const showFinishDialog = (isWinner, finishCards) => {
  if (finishCards.length < 1) {
    console.log("you are out of finish cards");
  } else {
    createBetButtons(finishBetDialog, finishCards, isWinner);
    finishBetDialog.showModal();
  }
};
