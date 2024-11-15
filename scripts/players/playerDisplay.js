const legBetContainer = document.getElementById("leg-bet-container");

const finishWinnerButton = document.getElementById("finish-winner-button");
const finishLoserButton = document.getElementById("finish-loser-button");
const finishBetDialog = document.getElementById("finish-bet-dialog");
const finishBetCancelButton = document.getElementById(
  "finish-bet-cancel-button"
);
let isPickingWinner = null;

const spectatorButton = document.getElementById("spectator-button");
const spectatorDialog = document.getElementById("spectator-dialog");
const cheeringButton = document.getElementById("cheering-button");
const booingButton = document.getElementById("booing-button");
const spectatorCancelButton = document.getElementById(
  "spectator-cancel-button"
);

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
  spectatorDialog.close();
  displaySpectatorPlacers(true);
});
booingButton.addEventListener("click", () => {
  spectatorDialog.close();
  displaySpectatorPlacers(false);
});

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
const displaySpectatorTile = (isCheering) => {
  const tile = document.createElement("div");
  tile.id = `${currentPlayer.name}-spectator-tile`;
  if (isCheering) {
    tile.className = "spectator-tile cheering-tile";
    tile.innerHTML = `<p>${currentPlayer.name}</p> <p>+1</p>`;
  } else {
    tile.className = "spectator-tile booing-tile";
    tile.innerHTML = `<p>${currentPlayer.name}</p> <p>-1</p>`;
  }
  const tilePosition = currentPlayer.spectatorTile.position;
  const tileSpace = document.getElementById(`track-space-${tilePosition}`);
  tileSpace.appendChild(tile);
};

// creates buttons on each permitted space where a tile can be placed
const displaySpectatorPlacers = (isCheering) => {
  oldTile = document.getElementById(`${currentPlayer.name}-spectator-tile`);
  if (oldTile) {
    oldTile.remove();
  }

  // tile can't be placed on space 1, space with a camel, or space with or adjacent to another tile
  let prohibitedSpaces = [1];
  allCamels.forEach((c) => {
    prohibitedSpaces.push(c.position);
  });
  allPlayers.forEach((p) => {
    if (p !== currentPlayer) {
      prohibitedSpaces.push(
        p.spectatorTile.position,
        p.spectatorTile.position + 1,
        p.spectatorTile.position - 1
      );
    }
  });
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
        currentPlayer.placeSpectatorTile(isCheering, spaceNumber)
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
