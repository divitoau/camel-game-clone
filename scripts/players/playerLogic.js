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

let playerNames = ["Austin", "Segundo", "Tercero"];

const allPlayers = [];

const generatePlayers = () => {
  playerNames.forEach((n) => {
    let finishArray = allDice
      .map((c) => {
        if (c !== "grey") {
          return new FinishCard(c, n);
        }
      })
      .filter((f) => f !== undefined);
    allPlayers.push(
      new Player(n, 3, [], 0, new SpectatorTile(n, null, null), finishArray)
    );
  });
};

generatePlayers();

let currentPlayerNumber = 0;
let currentPlayer = allPlayers[currentPlayerNumber];
console.log(`${currentPlayer.name}'s turn`);

const endTurn = () => {
  currentPlayerNumber = (currentPlayerNumber + 1) % allPlayers.length;
  currentPlayer = allPlayers[currentPlayerNumber];
  console.log(`${currentPlayer.name}'s turn`);
};
