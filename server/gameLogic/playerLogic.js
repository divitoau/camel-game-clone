const gameState = require("./gameState");
const { bopPyramid } = require("./diceLogic");

const racerColors = ["blue", "yellow", "green", "red", "purple"];

class SpectatorTile {
  constructor(player, isCheering, position) {
    this.player = player;
    this.isCheering = isCheering;
    this.position = position;
  }
}

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
    const betColorArray = gameState.remainingBettingTickets[color];
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
    bopPyramid();
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

const addPlayer = (name) => {
  gameState.playerNames.push(name);
};

const generatePlayers = () => {
  const generatedPlayers = gameState.playerNames.map((n) => {
    let finishArray = racerColors.map((c) => {
      return new FinishCard(c, n);
    });
    return new Player(
      n,
      3,
      [],
      0,
      new SpectatorTile(n, null, null),
      finishArray
    );
  });
  gameState.setPlayers(generatedPlayers);
  gameState.setCurrentPlayerIndex(
    Math.floor(Math.random() * gameState.allPlayers.length)
  );
  /*   console.log(
    `${gameState.allPlayers[gameState.currentPlayerIndex].name}'s turn`
  ); */
};

const regeneratePlayers = () => {
  gameState.allPlayers.length = 0;
  generatePlayers();
};

const endTurn = () => {
  gameState.setCurrentPlayerIndex(
    (gameState.currentPlayerIndex + 1) % gameState.allPlayers.length
  );
};

module.exports = {
  addPlayer,
  generatePlayers,
};
