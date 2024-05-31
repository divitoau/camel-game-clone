const socket = io();

socket.on("connect", () => {
  const playerId = getPlayerId();
  socket.emit("playerId", playerId ? playerId : "");
});

socket.on("fullState", (state) => {
  console.log(state);
  if (state.allPlayers.length < 2) {
    openStartDialog();
  } else {
    displayCamels(state.allCamels);
    displayDice(state.diceOnTents);
  }
});

socket.on("newPlayerRes", (res, playerNames) => {
  console.log(res);
  if (playerNames) {
    console.log(playerNames);
    if (playerNames.length === 2) {
      promptStartGame();
    }
  }
});

socket.on("startGameRes", (state) => {
  gameStartDialog.close();
  displayCamels(state.allCamels);
});

socket.on("takePyramidTicketRes", (player, dice, allCamels, allPlayers) => {
  displayDice(dice);
  displayNewPosition(allCamels);
  console.log(
    `${player.name} snagged a pyramid ticket, now has ${player.pyramidTickets}`
  );
});

const addPlayer = () => {
  const name = newPlayerInput.value.trim().substring(0, 16);
  if (name === "") {
    console.log("Player name cannot be empty");
    newPlayerInput.value = "";
  } else {
    socket.emit("newPlayer", name, setPlayerId());
    newPlayerInput.value = "";
  }
};

const startGame = () => {
  socket.emit("startGame");
};

const takePyramidTicket = () => {
  socket.emit("takePyramidTicket");
};
