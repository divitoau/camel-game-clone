const playerNames = [];
const allPlayers = [];
let currentPlayer;
let currentPlayerIndex;

const racerColors = ["blue", "yellow", "green", "red", "purple"];

class FinishCard {
  constructor(color, playerName) {
    this.color = color;
    this.playerName = playerName;
  }
}

class Player {
  constructor(
    name,
    money,
    bettingTickets,
    pyramidTickets,
    spectatorTile,
    finishCards
  ) {
    this.name = name;
    this.money = money;
    this.bettingTickets = bettingTickets;
    this.pyramidTickets = pyramidTickets;
    this.spectatorTile = spectatorTile;
    this.finishCards = finishCards;
  }

  takeBettingTicket(color) {
    const betColorArray = remainingBettingTickets[color];
    if (betColorArray.length > 0) {
      const takenTicket = betColorArray.shift();
      this.bettingTickets.push(takenTicket);
      console.log(
        `${this.name} snagged a ${takenTicket.value} pound ${takenTicket.color} ticket`
      );
      endTurn();
    } else {
      console.log("no tickets of this color are left");
    }
  }

  takePyramidTicket() {
    this.pyramidTickets += 1;
    console.log(
      `${this.name} snagged a pyramid ticket, now has ${this.pyramidTickets}`
    );
    endTurn();
  }

  placeSpectatorTile(isCheering, position) {
    this.spectatorTile.isCheering = isCheering;
    this.spectatorTile.position = position;
    removeSpectatorPlacers();
    displaySpectatorTile(isCheering);
    endTurn();
  }

  placeFinishCard(color, isWinner) {
    const finishCard = this.finishCards.find((f) => f.color === color);
    const finishIndex = this.finishCards.indexOf(finishCard);
    this.finishCards.splice(finishIndex, 1);
    if (isWinner) {
      finishWinnerStack.push(finishCard);
    } else {
      finishLoserStack.push(finishCard);
    }
    console.log(
      `${this.name} placed a bet on overall ${isWinner ? "winner" : "loser"}`
    );
    endTurn();
  }

  resolveLeg(newMoney) {
    this.money = newMoney;
    this.bettingTickets = [];
    this.pyramidTickets = 0;
    this.spectatorTile.isCheering = null;
    this.spectatorTile.position = null;
  }
}

class SpectatorTile {
  constructor(player, isCheering, position) {
    this.player = player;
    this.isCheering = isCheering;
    this.position = position;
  }
}

const getCurrentPlayer = () => {
  return currentPlayer;
};

const addPlayer = (name) => {
  let msg;
  if (name === "") {
    msg = "Player name cannot be empty";
  } else if (playerNames.includes(name)) {
    msg = `${name} is already taken`;
  } else {
    playerNames.push(name);
    msg = `${name} added`;
    /*     if (playerNames.length === 2) {
      // ******* figure out some logic designating a host who can start the game
    } */
  }
  return msg;
};

const generatePlayers = () => {
  playerNames.forEach((n) => {
    let finishArray = racerColors.map((c) => {
      return new FinishCard(c, n);
    });
    allPlayers.push(
      new Player(n, 3, [], 0, new SpectatorTile(n, null, null), finishArray)
    );
  });
  currentPlayerIndex = Math.floor(Math.random() * allPlayers.length);
  currentPlayer = allPlayers[currentPlayerIndex];
  console.log(`${currentPlayer.name}'s turn`);
};

const resetPlayers = () => {
  allPlayers.length = 0;
  generatePlayers();
};

const endTurn = () => {
  currentPlayerIndex = (currentPlayerIndex + 1) % allPlayers.length;
  currentPlayer = allPlayers[currentPlayerIndex];
  console.log(`${currentPlayer.name}'s turn`);
};

module.exports = {
  allPlayers,
  playerNames,
  getCurrentPlayer,
  addPlayer,
  generatePlayers,
};
