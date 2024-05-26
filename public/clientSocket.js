const socket = io();

socket.on("fullState", (state) => {
  console.log(state);
  if (state.allPlayers.length < 2) {
    openStartDialog();
  } else {
    displayCamels(state.allCamels);
  }
});

socket.on("newPlayerRes", (res, playerNames) => {
  console.log(res);
  console.log(playerNames);
  if (playerNames.length === 2) {
    promptStartGame();
  }
});

socket.on("startGameRes", (state) => {
  gameStartDialog.close();
  displayCamels(state.allCamels);
});

const addPlayer = () => {
  const newPlayer = newPlayerInput.value.trim().substring(0, 16);
  if (newPlayer === "") {
    console.log("Player name cannot be empty");
    newPlayerInput.value = "";
  } else {
    socket.emit("newPlayer", newPlayer);
    newPlayerInput.value = "";
  }
};

const startGame = () => {
  socket.emit("startGame");
};
