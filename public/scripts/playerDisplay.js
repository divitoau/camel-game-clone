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

const finishWinnerContainer = document.getElementById(
  "finish-winner-container"
);
const finishLoserContainer = document.getElementById("finish-loser-container");

dicePyramid.addEventListener("click", () => {
  removeAllElements(".place-button");
  removeAllElements(".finish-button");
  replaceSpectatorTile();
  takePyramidTicket();
});

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
    tileElement.addEventListener("click", () => {
      removeAllElements(".place-button");
      removeAllElements(".finish-button");
      spectatorDialog.showModal();
    });
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
    cardElement.addEventListener("click", () => {
      removeAllElements(".place-button");
      removeAllElements(".finish-button");
      replaceSpectatorTile();
      choseFinishSpot(f.color);
    });
    heldFinishCardsContainer.appendChild(cardElement);
  });
};

const choseFinishSpot = (color) => {
  finishWinnerContainer.innerHTML += `<button id="win-button" class="finish-button">Bet ${color} to Win</button>`;
  finishLoserContainer.innerHTML += `<button id="lose-button" class="finish-button">Bet ${color} to Lose</button>`;
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

  winButton.focus();
};

// shows the newly placed spectator tile on DOM
const displaySpectatorTile = (tile, isYours) => {
  const { isCheering, player, position } = tile;
  removeAllElements(`#${player}-spectator-tile`);
  const tileElement = document.createElement("div");
  tileElement.id = `${player}-spectator-tile`;
  tileElement.className = `spectator-tile ${
    isCheering ? "cheering" : "booing"
  }-tile`;
  tileElement.innerHTML = `
      <p class="card-player">${player}</p>
      <img class="thumb" src="./images/thumb.svg" alt="a thumbs-${
        isCheering ? 'up"/>' : 'down" style="transform: rotate(180deg)"/>'
      }
      <p>${isCheering ? "+" : "-"}1</p>`;
  if (isYours) {
    const clickBox = document.createElement("div");
    const overlay = document.createElement("div");
    clickBox.className = "click-box";
    overlay.className = "block-overlay";
    clickBox.addEventListener("click", () => {
      removeAllElements(".finish-button");
      spectatorDialog.showModal();
    });
    tileElement.classList.add("your-spectator-tile");
    tileElement.appendChild(clickBox);
    tileElement.appendChild(overlay);
  }
  const tileSpace = document.getElementById(`track-space-${position}`);
  tileSpace?.appendChild(tileElement);
  floatingSpectatorTile = null;
};

// this lets spectator tile be redisplayed on board if placement is interrupted
let floatingSpectatorTile = null;

const replaceSpectatorTile = () => {
  if (floatingSpectatorTile) {
    displaySpectatorTile(floatingSpectatorTile, true);
    floatingSpectatorTile = null;
    toggleOverlays(false);
  }
};

// creates buttons on each permitted space where a tile can be placed
const displaySpectatorPlacers = (
  currentPlayerName,
  prohibitedSpaces,
  isCheering,
  currentTile
) => {
  floatingSpectatorTile = currentTile;
  removeAllElements(`#${currentPlayerName}-spectator-tile`);
  document.querySelectorAll(".track-space").forEach((s) => {
    const spaceNumber = parseInt(s.id.substring(12));
    if (!prohibitedSpaces.includes(spaceNumber)) {
      if (spaceNumber === currentTile.position) {
        const cancelButton = document.createElement("button");
        cancelButton.className = "place-button";
        cancelButton.id = `spectator-cancel-button`;
        cancelButton.textContent = "Cancel";
        cancelButton.addEventListener("click", () => {
          removeAllElements(".place-button");
          replaceSpectatorTile();
        });
        s.appendChild(cancelButton);
        if (isCheering === currentTile.isCheering) {
          return;
        }
      }
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
