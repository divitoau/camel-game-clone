const socket = io();

const autoPlay = false;
let autoDiceCount = 0;

socket.on("connect", () => {
  setIsGameHost(false);
  const clientId = getClientId();
  socket.emit("clientId", clientId ? clientId : setClientId());
});

socket.on("fullState", (state) => {
  displayState(state);
  displayDice(state.diceOnTents);
  state.spectatorTiles.forEach((t) => {
    displaySpectatorTile(t);
  });
});

socket.on("permissionDeny", () => {
  console.log("you do not have permission for this action");
});

socket.on("issueEncounter", (msg) => {
  alert(msg);
});

socket.on("newPlayerRes", (playerNames, hostName) => {
  closeDialogsExcept(gameStartDialog);
  if (!gameStartDialog.hasAttribute("open")) {
    openStartDialog();
  }
  displayNewPlayer(playerNames, hostName);
  if (playerNames.length < 2) {
    removeAllElements(".start-prompt");
  }
  if (playerNames.length === 2) {
    const isHost = getIsGameHost();
    promptStartGame(isHost);
  }
  // ****** this needs to be reworked
  /*   if (!document.contains(newPlayerForm)) {
    gameStartDialog.appendChild(newPlayerForm);
  } */
});

socket.on("yourName", (name) => {
  highlightYourName(name);
  checkAndRemove(newPlayerForm);
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
      }, 1000);
    }
  }
});

socket.on("startGameRes", (state) => {
  checkAndRemove("restart-button");
  checkAndRemove(proceedButton);
  if (!document.contains(legSummaryButton)) {
    legSummaryDialog.appendChild(legSummaryButton);
  }
  closeDialogsExcept(null);
  displayState(state);
});

socket.on("playerStates", (player, otherPlayers) => {
  updatePlayerDisplay(player);
  console.log(otherPlayers);
});

socket.on("takePyramidTicketRes", (player, dice, allCamels) => {
  displayDice(dice);
  displayNewPosition(allCamels);
  console.log(
    `${player.name} snagged a pyramid ticket, now has ${player.pyramidTickets}`
  );
});

socket.on("endLeg", (legResults, bettingTickets, isCurrent) => {
  closeDialogsExcept(legBetDialog);
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

socket.on("spectatorTileRes", (spectatorTile) => {
  removeAllElements(".place-button");
  displaySpectatorTile(spectatorTile);
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
  closeDialogsExcept(legBetDialog);
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

const addPlayer = () => {
  const name = newPlayerInput.value.trim().substring(0, 16);
  if (!name) {
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
