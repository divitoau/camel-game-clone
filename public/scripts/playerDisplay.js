const dicePyramid = document.getElementById("dice-pyramid");

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
const spectatorTileDisplay = document.getElementById("spectator-tile-display");
const heldLegBetsContainer = document.getElementById("held-leg-bets-container");
const heldFinishCardsContainer = document.getElementById(
  "held-finish-cards-container"
);

dicePyramid.addEventListener("click", () => takePyramidTicket());

spectatorCancelButton.addEventListener("click", () => spectatorDialog.close());
cheeringButton.addEventListener("click", () => {
  requestSpectatorSpaces(true);
  spectatorDialog.close();
});
booingButton.addEventListener("click", () => {
  requestSpectatorSpaces(false);
  spectatorDialog.close();
});

const updatePlayerDisplay = (player) => {
  moneyCount.innerText = player.money;
  updateHeldPyramidTickets(player);
  updateHeldSpectatorTile(player);
  updateHeldBettingTickets(player);
  updateHeldFinishCards(player);
};

const updateHeldPyramidTickets = (player) => {
  pyramidTicketsDisplay.innerHTML = "";
  for (let i = 0; i < player.pyramidTickets; i++) {
    pyramidTicketsDisplay.innerHTML += `
        <img
          class="pyramid-ticket"
          src="images/pyramidToken.svg"
          alt="a square with the letter P"
        />`;
  }
};

const updateHeldSpectatorTile = (player) => {
  spectatorTileDisplay.innerHTML = "";
  if (player.spectatorTile.position === null) {
    const tileElement = document.createElement("div");
    tileElement.className = "spectator-tile neutral-tile";
    tileElement.innerHTML = `
      <p class="card-player">${player.name}</p>
      <img class="thumb" src="./images/thumb.svg" alt="a thumb" />
      <img
        class="thumb"
        src="./images/thumb.svg"
        alt="a thumb"
        style="transform: rotate(180deg)"
      />
      <p>±1</p>`;
    tileElement.addEventListener("click", () => spectatorDialog.showModal());
    spectatorTileDisplay.appendChild(tileElement);
  }
};

const updateHeldBettingTickets = (player) => {
  let bettingTicketsDisplay = "";
  player.bettingTickets.forEach((b) => {
    bettingTicketsDisplay += `
      <div class="game-card leg-bet-card">
        <p class="leg-bet-value ${b.color}">${b.value}</p>
        <img
          class="card-camel ${b.color}-card-camel"
          src="images/camel.svg"
          alt="a ${b.color} camel"
        />
      </div>`;
  });
  heldLegBetsContainer.innerHTML = bettingTicketsDisplay;
};

const updateHeldFinishCards = (player) => {
  heldFinishCardsContainer.innerHTML = "";
  player.finishCards.forEach((f) => {
    const cardElement = document.createElement("div");
    cardElement.className = "game-card finish-card";
    cardElement.innerHTML = `
    <p class="card-player">${player.name}</p>
    <img
      class="card-camel ${f.color}-card-camel"
      src="images/camel.svg"
      alt="a ${f.color} camel"
    />`;
    cardElement.addEventListener("click", () => choseFinishSpot(f.color));
    heldFinishCardsContainer.appendChild(cardElement);
  });
};

const choseFinishSpot = (color) => {
  finishWinnerContainer.innerHTML += `<button id="win-button">Bet ${color} to Win</button>`;
  finishLoserContainer.innerHTML += `<button id="lose-button">Bet ${color} to Lose</button>`;
  const winButton = document.getElementById("win-button");
  const loseButton = document.getElementById("lose-button");

  winButton.addEventListener("click", () => {
    placeFinishCard(color, true);
    winButton.remove();
    loseButton.remove();
  });
  loseButton.addEventListener("click", () => {
    placeFinishCard(color, false);
    winButton.remove();
    loseButton.remove();
  });
};

// shows the newly placed spectator tile on DOM
const displaySpectatorTile = (tile, isYours) => {
  checkAndRemove(`${tile.player}-spectator-tile`);
  const tileElement = document.createElement("div");
  tileElement.id = `${tile.player}-spectator-tile`;
  tileElement.className = `spectator-tile ${
    tile.isCheering ? "cheering" : "booing"
  }-tile`;
  tileElement.innerHTML = `<p>${tile.player}</p> <p>${
    tile.isCheering ? "+" : "-"
  }1</p>`;
  if (isYours) {
    tileElement.addEventListener("click", () => spectatorDialog.showModal());
  }
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
