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
    clientID,
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

  takeBettingTicket(betColorArray) {
    const takenTicket = betColorArray.shift();
    this.bettingTickets.push(takenTicket);
    console.log(
      `${this.name} snagged a ${takenTicket.value} pound ${takenTicket.color} ticket`
    );
    endTurn();
  }

  takePyramidTicket() {
    this.pyramidTickets += 1;
    const isFinished = bopPyramid();
    endTurn();
    return isFinished;
  }

  placeSpectatorTile(isCheering, position) {
    this.spectatorTile.isCheering = isCheering;
    this.spectatorTile.position = position;
    endTurn();
  }

  placeFinishCard(finishCard, isWinner) {
    const finishIndex = this.finishCards.indexOf(finishCard);
    this.finishCards.splice(finishIndex, 1);
    if (isWinner) {
      gameState.finishWinnerStack.push(finishCard);
    } else {
      gameState.finishLoserStack.push(finishCard);
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

const generatePlayers = (players) => {
  const generatedPlayers = players.map((p) => {
    let finishArray = racerColors.map((c) => {
      return new FinishCard(c, p.name);
    });
    return new Player(
      p.name,
      p.clientID,
      3,
      [],
      0,
      new SpectatorTile(p.name, null, null),
      finishArray
    );
  });
  gameState.setPlayers(generatedPlayers);
  gameState.setCurrentPlayerIndex(
    Math.floor(Math.random() * gameState.allPlayers.length)
  );
};

const endTurn = () => {
  gameState.setCurrentPlayerIndex(
    (gameState.currentPlayerIndex + 1) % gameState.allPlayers.length
  );
};

module.exports = {
  generatePlayers,
};
