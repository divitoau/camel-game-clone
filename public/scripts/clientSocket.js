const socket = io();

let autoDiceCount = 0;

socket.on("connect", () => {
  setIsGameHost(false);
  const clientId = getClientId();
  socket.emit("clientId", clientId ? clientId : setClientId());
});

socket.on("fullState", (state, yourName) => {
  displayState(state);
  displayDice(state.diceOnTents);
  state.spectatorTiles.forEach((t) => {
    displaySpectatorTile(t, t.player === yourName);
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
  if (
    !document.querySelector(".your-name") &&
    !document.contains(newPlayerForm)
  ) {
    gameStartDialog.appendChild(newPlayerForm);
  }
});

socket.on("yourName", (name) => {
  highlightYourName(name);
  removeAllElements(newPlayerForm);
});

socket.on("declareHost", (isHost) => {
  setIsGameHost(isHost);
});

socket.on("yourTurn", () => {
  toggleOverlays(false);
});

socket.on("notYourTurn", () => {
  toggleOverlays(true);
});

socket.on("startGameRes", (state, playerNames) => {
  removeAllElements(".spectator-tile");
  removeAllElements("#restart-button");
  removeAllElements(proceedButton);
  if (!document.contains(legSummaryButton)) {
    legSummaryDialog.appendChild(legSummaryButton);
  }
  closeDialogsExcept(null);
  displayState(state);
  createScoreboard(playerNames);
});

socket.on("playerStates", (player, otherPlayers) => {
  const allNameplates = document.querySelectorAll(".opp-nameplate");
  if (allNameplates.length !== otherPlayers.length) {
    allNameplates.forEach((n) => {
      removeAllElements(n);
    });
    otherPlayerNames = otherPlayers.map((p) => p.name);
    createScoreboard(otherPlayerNames);
  }
  if (player) {
    updatePlayerDisplay(player);
  }
  updateScoreboard(otherPlayers);
});

socket.on("takePyramidTicketRes", (player, dice, allCamels) => {
  displayDice(dice);
  displayNewPosition(allCamels);
  console.log(
    `${player.name} snagged a pyramid ticket, now has ${player.pyramidTickets}`
  );
});

socket.on("endLeg", (legResults, bettingTickets, isCurrent, name) => {
  closeDialogsExcept(null);
  setTimeout(() => {
    displayBettingTickets(bettingTickets);
    displayLegResults(legResults);
    resetTents();
    removeAllElements(".spectator-tile");
    // dummy player object to make function work properly
    updateHeldSpectatorTile({ name: name, spectatorTile: { position: null } });
    if (isCurrent) {
      toggleOverlays(false);
    }
  }, 1000);
});

socket.on(
  "spectatorSpaces",
  (currentPlayerName, prohibitedSpaces, isCheering, currentTile) => {
    displaySpectatorPlacers(
      currentPlayerName,
      prohibitedSpaces,
      isCheering,
      currentTile
    );
  }
);

socket.on("spectatorTileRes", (spectatorTile, isYours) => {
  removeAllElements(".place-button");
  displaySpectatorTile(spectatorTile, isYours);
});

socket.on("updateBettingTickets", (bettingTickets) => {
  displayBettingTickets(bettingTickets);
});

socket.on("updateFinishStack", (isWinner, finishStack) => {
  displayFinishStack(isWinner, finishStack);
});

socket.on("finalEndLeg", (finalResults) => {
  removeAllElements(".spectator-tile");
  closeDialogsExcept(null);
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

const getFinishCards = (isWinner) => {
  socket.emit("getFinishCards", isWinner);
};

const takeBettingTicket = (color) => {
  if (document.querySelector(`.${color}-leg-bet-card`)) {
    socket.emit("takeBettingTicket", color);
  }
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
