const gameStartDialog = document.getElementById("game-start-dialog");
const addPlayerButton = document.getElementById("add-player-button");
const newPlayerInput = document.getElementById("new-player-input");
const startingPlayerList = document.getElementById("starting-player-list");

addPlayerButton.addEventListener("click", () => addPlayer());

/* if (playerNames.length < 2) {
  gameStartDialog.showModal();
} */

/* const addPlayer = () => {
  const newPlayer = newPlayerInput.value.trim().substring(0, 16);
  if (newPlayer === "") {
    console.log("Player name cannot be empty");
    newPlayerInput.value = "";
  } else if (playerNames.includes(newPlayer)) {
    console.log(`${newPlayer} is already taken`);
  } else {
    playerNames.push(newPlayer);
    if (playerNames.length === 2) {
      promptStartGame();
    }
    const playerElement = document.createElement("p");
    playerElement.textContent = newPlayer;
    startingPlayerList.appendChild(playerElement);
    newPlayerInput.value = "";
  }
}; */

const promptStartGame = () => {
  startGameButton = document.createElement("button");
  startGameButton.innerText = "start game";
  startGameButton.addEventListener("click", () => startGame());
  gameStartDialog.appendChild(startGameButton);
};

const startGame = () => {
  gameStartDialog.close();
  generatePlayers();
  setStartingPositions();
  displayCamels();
};
