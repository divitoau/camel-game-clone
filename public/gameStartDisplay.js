const gameStartDialog = document.getElementById("game-start-dialog");
const addPlayerButton = document.getElementById("add-player-button");
const newPlayerInput = document.getElementById("new-player-input");
const startingPlayerList = document.getElementById("starting-player-list");

addPlayerButton.addEventListener("click", () => addPlayer());

const openStartDialog = () => {
  const oldButton = document.getElementById("start-game-button");
  const waitingText = document.getElementById("waiting-text");
  if (oldButton) {
    oldButton.remove();
  }
  if (waitingText) {
    waitingText.remove();
  }
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
  const oldButton = document.getElementById("start-game-button");
  if (oldButton) {
    oldButton.remove();
  }
  const startGameButton = document.createElement("button");
  startGameButton.id = "start-game-button";
  startGameButton.innerText = "start game";
  if (!isHost) {
    startGameButton.setAttribute("disabled", "");
    const waitingText = document.createElement("p");
    waitingText.id = "waiting-text";
    waitingText.textContent = "waiting for host to start game...";
    gameStartDialog.appendChild(waitingText);
  }
  startGameButton.addEventListener("click", () => startGame());
  gameStartDialog.appendChild(startGameButton);
};
