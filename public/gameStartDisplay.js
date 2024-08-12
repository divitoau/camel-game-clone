const gameStartDialog = document.getElementById("game-start-dialog");
const addPlayerButton = document.getElementById("add-player-button");
const newPlayerInput = document.getElementById("new-player-input");
const startingPlayerList = document.getElementById("starting-player-list");
const newPlayerForm = document.getElementById("new-player-form");

addPlayerButton.addEventListener("click", () => {
  if (newPlayerForm.checkValidity()) {
    addPlayer();
    newPlayerInput.value = "";
  } else {
    newPlayerForm.reportValidity();
  }
});

const openStartDialog = () => {
  checkAndRemove(".start-prompt");
  gameStartDialog.showModal();
};

const displayNewPlayer = (playerNames, hostName) => {
  removeAllElements("#starting-player-list li");
  playerNames.forEach((name) => {
    const playerElement = document.createElement("li");
    playerElement.className = "player-name";
    let nameString = name;
    if (name === hostName) {
      nameString += " (Host)";
      playerElement.id = "host-name";
    }
    playerElement.textContent = nameString;
    startingPlayerList.appendChild(playerElement);
  });
};

const highlightYourName = (name) => {
  const nameElements = document.querySelectorAll("#starting-player-list li");
  nameElements.forEach((e) => {
    let elementName = e.textContent;
    if (e.id === "host-name") {
      elementName = elementName.substring(0, elementName.length - 7);
    }
    if (elementName === name) {
      e.classList.add("highlight");
    }
  });
};

const promptStartGame = (isHost) => {
  removeAllElements(".start-prompt");
  if (isHost) {
    const startGameButton = document.createElement("button");
    startGameButton.id = "start-game-button";
    startGameButton.className = "start-prompt";
    startGameButton.innerText = "start game";
    startGameButton.addEventListener("click", () => startGame());
    gameStartDialog.appendChild(startGameButton);
  } else {
    const waitingText = document.createElement("p");
    waitingText.id = "waiting-text";
    waitingText.className = "start-prompt";
    waitingText.textContent = "waiting for host to start game...";
    gameStartDialog.appendChild(waitingText);
  }
};
