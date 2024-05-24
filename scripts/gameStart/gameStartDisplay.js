const gameStartDialog = document.getElementById("game-start-dialog");
const addPlayerButton = document.getElementById("add-player-button");
const newPlayerInput = document.getElementById("new-player-input");
const startingPlayerList = document.getElementById("starting-player-list");

addPlayerButton.addEventListener("click", () => addPlayer());

if (playerNames.length < 2) {
  gameStartDialog.showModal();
}

const addPlayer = () => {
  const newPlayer = newPlayerInput.value;
  if (playerNames.includes(newPlayer)) {
    console.log(`${newPlayer} is already taken`);
  } else {
    playerNames.push(newPlayer);
    if (playerNames.length === 2) {
      promptStartGame();
    }
    startingPlayerList.innerHTML += `<p>${newPlayer}</p>`;
    newPlayerInput.value = "";
  }
};

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
