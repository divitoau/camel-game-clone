const socket = io();

const autoPlay = false;
let autoDiceCount = 0;

socket.on("connect", () => {
  const clientId = getClientId();
  socket.emit("clientId", clientId ? clientId : setClientId());
});

socket.on("fullState", (state) => {
  displayState(state);
  displayDice(state.diceOnTents);
  state.allPlayers.forEach((p) => {
    const tile = p.spectatorTile;
    displaySpectatorTile(tile.player, tile.isCheering, tile.position);
  });
});

socket.on("permissionDeny", () => {
  console.log("you do not have permission for this action");
});

socket.on("issueEncounter", (msg) => {
  alert(msg);
});

socket.on("newPlayerRes", (playerNames, hostName) => {
  closeDialogs();
  openStartDialog();
  if (playerNames) {
    displayNewPlayer(playerNames, hostName);
    if (playerNames.length > 1) {
      const isHost = getIsGameHost();
      promptStartGame(isHost);
    }
  }
});

socket.on("yourName", (name) => {
  highlightYourName(name);
  newPlayerForm.remove();
});

socket.on("declareHost", (isHost) => {
  setIsGameHost(isHost);
});

socket.on("yourTurn", () => {
  enableActionButtons();
  if (autoPlay) {
    setTimeout(() => {
      socket.emit("takePyramidTicket");
    }, 200);
    autoDiceCount += 1;
    if (autoDiceCount === 5) {
      autoDiceCount = 0;
      console.log(autoDiceCount);
      setTimeout(() => {
        legSummaryDialog.close();
        resetTents();
        removeAllElements(".spectator-tile");
        socket.emit("takePyramidTicket");
      }, 1000);
    }
  }
});

socket.on("notYourTurn", () => {
  disableActionButtons();
  if (autoPlay) {
    autoDiceCount += 1;
    if (autoDiceCount === 5) {
      autoDiceCount = 0;
      console.log(autoDiceCount);
      setTimeout(() => {
        legSummaryDialog.close();
        resetTents();
        removeAllElements(".spectator-tile");
      }, 1000);
    }
  }
});

socket.on("startGameRes", (state) => {
  gameStartDialog.close();
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

socket.on("endLeg", (legResults, bettingTickets, isCurrent) => {
  closeDialogs();
  if (autoPlay) {
    displayBettingTickets(bettingTickets);
    displayLegResults(legResults);
  } else {
    setTimeout(() => {
      displayBettingTickets(bettingTickets);
      displayLegResults(legResults);
      resetTents();
      removeAllElements(".spectator-tile");
      if (isCurrent) {
        enableActionButtons();
      }
    }, 1000);
  }
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

socket.on("finalEndLeg", (finalResults) => {
  closeDialogs();
  displayFinalLeg(finalResults);
});

socket.on(
  "endRace",
  (winnerCardScores, loserCardScores, totalFinishRewards, rankedPlayers) => {
    updateFinalSummary(
      winnerCardScores,
      loserCardScores,
      totalFinishRewards,
      rankedPlayers
    );
  }
);

socket.on("promptRestart", () => {
  promptRestart();
});

const closeDialogs = () => {
  legSummaryDialog.close();
  gameStartDialog.close();
  spectatorDialog.close();
  legBetDialog.close();
  finishBetDialog.close();
  finalSummaryDialog.close();
};

const addPlayer = () => {
  const name = newPlayerInput.value.trim().substring(0, 16);
  if (name === "") {
    console.log("Player name cannot be empty");
  } else {
    socket.emit("newPlayer", name, setClientId());
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

const startNewGame = (isSamePlayers) => {
  socket.emit("startNewGame", isSamePlayers);
};
