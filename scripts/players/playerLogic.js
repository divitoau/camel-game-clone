class Player {
  constructor(name, money, bettingTickets, pyramidTickets, spectatorTile) {
    this.name = name;
    this.money = money;
    this.bettingTickets = bettingTickets;
    this.pyramidTickets = pyramidTickets;
    this.spectatorTile = spectatorTile;
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

const allPlayers = [
  new Player("Austin", 3, [], 0, new SpectatorTile("Austin", null, null)),
  new Player("Enemy", 3, [], 0, new SpectatorTile("Enemy", null, null)),
  new Player("Third Guy", 3, [], 0, new SpectatorTile("Third Guy", null, null)),
];

let currentPlayerNumber = 0;
let currentPlayer = allPlayers[currentPlayerNumber];
console.log(`${currentPlayer.name}'s turn`);

const endTurn = () => {
  currentPlayerNumber = (currentPlayerNumber + 1) % allPlayers.length;
  currentPlayer = allPlayers[currentPlayerNumber];
  console.log(`${currentPlayer.name}'s turn`);
};
