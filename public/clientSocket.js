const socket = io();

socket.on("connect", () => {
  const clientId = getClientId();
  socket.emit("clientId", clientId ? clientId : setClientId());
});

socket.on("fullState", (state) => {
  if (state.allPlayers.length < 2) {
    openStartDialog();
  } else {
    displayState(state);
    displayDice(state.diceOnTents);
    state.allPlayers.forEach((p) => {
      const tile = p.spectatorTile;
      displaySpectatorTile(tile.player, tile.isCheering, tile.position);
    });
  }
});

socket.on("permissionDeny", () => {
  console.log("you do not have permission for this action");
});

socket.on("newPlayerRes", (res, playerNames) => {
  console.log(res);
  if (playerNames) {
    console.log(playerNames);
    if (playerNames.length === 2 && getIsGameHost()) {
      promptStartGame();
    }
  }
});

socket.on("declareHost", (isHost) => {
  setIsGameHost(isHost);
});

socket.on("yourTurn", () => {
  enableActionButtons();
  console.log("your turn");
});

socket.on("notYourTurn", () => {
  disableActionButtons();
});

socket.on("startGameRes", (state) => {
  gameStartDialog.close();
  console.log("start game");
  displayState(state);
});

socket.on("yourPlayerState", (player) => {
  updatePlayerDisplay(player);
});

socket.on("takePyramidTicketRes", (player, dice, allCamels) => {
  displayDice(dice);
  displayNewPosition(allCamels);
  console.log(
    `${player.name} snagged a pyramid ticket, now has ${player.pyramidTickets}`
  );
});

socket.on("endLeg", (legResults, bettingTickets) => {
  setTimeout(() => {
    displayBettingTickets(bettingTickets);
    displayLegResults(legResults);
  }, 2000);
});

socket.on(
  "spectatorSpaces",
  (currentPlayerName, prohibitedSpaces, isCheering) => {
    displaySpectatorPlacers(currentPlayerName, prohibitedSpaces, isCheering);
  }
);

socket.on("spectatorTileRes", (currentPlayerName, isCheering, spaceNumber) => {
  removeAllElements(".place-button");
  displaySpectatorTile(currentPlayerName, isCheering, spaceNumber);
});

socket.on("bettingTicketsRes", (bettingTickets) => {
  showBettingDialog(bettingTickets);
});

socket.on("updateBettingTickets", (bettingTickets) => {
  displayBettingTickets(bettingTickets);
});

socket.on("finishCardsRes", (isWinner, finishCards) => {
  showFinishDialog(isWinner, finishCards);
});

socket.on("updateFinishStack", (isWinner, finishStack) => {
  displayFinishStack(isWinner, finishStack);
});

const addPlayer = () => {
  const name = newPlayerInput.value.trim().substring(0, 16);
  if (name === "") {
    console.log("Player name cannot be empty");
    newPlayerInput.value = "";
  } else {
    socket.emit("newPlayer", name, setClientId());
    newPlayerInput.value = "";
  }
};

const startGame = () => {
  socket.emit("startGame");
};

const takePyramidTicket = () => {
  socket.emit("takePyramidTicket");
};

const requestSpectatorSpaces = (isCheering) => {
  socket.emit("requestSpectatorSpaces", isCheering);
};

const placeSpectatorTile = (isCheering, spaceNumber) => {
  socket.emit("placeSpectatorTile", isCheering, spaceNumber);
};

const getBettingTickets = () => {
  socket.emit("getBettingTickets");
};

const getFinishCards = (isWinner) => {
  socket.emit("getFinishCards", isWinner);
};

const takeBettingTicket = (color) => {
  socket.emit("takeBettingTicket", color);
};

const placeFinishCard = (color, isWinner) => {
  socket.emit("placeFinishCard", color, isWinner);
};

const displayState = (state) => {
  resetTents();
  removeCamels(state.allCamels);
  displayCamels(state.allCamels);
  displayBettingTickets(state.remainingBettingTickets);
  displayFinishStack(true, state.finishWinnerStack);
  displayFinishStack(false, state.finishLoserStack);
};
