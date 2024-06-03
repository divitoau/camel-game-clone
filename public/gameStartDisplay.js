const gameStartDialog = document.getElementById("game-start-dialog");
const addPlayerButton = document.getElementById("add-player-button");
const newPlayerInput = document.getElementById("new-player-input");
const startingPlayerList = document.getElementById("starting-player-list");

addPlayerButton.addEventListener("click", () => addPlayer());

const openStartDialog = () => {
  gameStartDialog.showModal();
};

// ***** this will take some working out with multiple sockets

/* const displayNewPlayer = () => {
  const playerElement = document.createElement("p");
  playerElement.textContent = newPlayer;
  startingPlayerList.appendChild(playerElement);
  newPlayerInput.value = "";
}; */

const promptStartGame = () => {
  const oldButton = document.getElementById("start-game-button");
  if (oldButton) {
    oldButton.remove();
  }
  const startGameButton = document.createElement("button");
  startGameButton.id = "start-game-button";
  startGameButton.innerText = "start game";
  startGameButton.addEventListener("click", () => startGame());
  gameStartDialog.appendChild(startGameButton);
};
