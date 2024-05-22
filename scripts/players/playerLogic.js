class Player {
  constructor(
    name,
    money,
    hasStartMarker,
    bettingTickets,
    pyramidTickets,
    hasSpectator
  ) {
    this.name = name;
    this.money = money;
    this.hasStartMarker = hasStartMarker;
    this.bettingTickets = bettingTickets;
    this.pyramidTickets = pyramidTickets;
    this.hasSpectator = hasSpectator;
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

  updateInventory(money, bettingTickets, pyramidTickets, hasSpectator) {
    this.money = money;
    this.bettingTickets = bettingTickets;
    this.pyramidTickets = pyramidTickets;
    this.hasSpectator = hasSpectator;
  }
}

const allPlayers = [
  new Player("Austin", 3, true, [], 0, true),
  new Player("Enemy", 3, false, [], 0, true),
];

let currentPlayerNumber = 0;
let currentPlayer = allPlayers[currentPlayerNumber];
console.log(`current player: ${currentPlayer.name}`);

const endTurn = () => {
  currentPlayerNumber = (currentPlayerNumber + 1) % allPlayers.length;
  currentPlayer = allPlayers[currentPlayerNumber];
  console.log(`current player: ${currentPlayer.name}`);
};
