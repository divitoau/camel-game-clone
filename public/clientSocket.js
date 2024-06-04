const socket = io();

socket.on("connect", () => {
  const clientId = getClientId();
  socket.emit("clientId", clientId ? clientId : setClientId());
});

socket.on("fullState", (state) => {
  console.log(state);
  if (state.allPlayers.length < 2) {
    openStartDialog();
  } else {
    removeCamels(state.allCamels);
    resetTents();
    displayCamels(state.allCamels);
    displayDice(state.diceOnTents);
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
  resetTents();
  removeCamels(state.allCamels);
  displayCamels(state.allCamels);
});

socket.on("yourPlayerState", (player) => {
  updatePlayerDisplay(player);
});

socket.on("takePyramidTicketRes", (player, dice, allCamels, allPlayers) => {
  displayDice(dice);
  displayNewPosition(allCamels);
  console.log(
    `${player.name} snagged a pyramid ticket, now has ${player.pyramidTickets}`
  );
});

socket.on("endLeg", (legResults) => {
  setTimeout(() => displayLegResults(legResults), 2000);
});

socket.on(
  "spectatorSpaces",
  (currentPlayerName, prohibitedSpaces, isCheering) => {
    displaySpectatorPlacers(currentPlayerName, prohibitedSpaces, isCheering);
  }
);

socket.on("spectatorTileRes", (currentPlayerName, isCheering, spaceNumber) => {
  removeSpectatorPlacers();
  displaySpectatorTile(currentPlayerName, isCheering, spaceNumber);
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
