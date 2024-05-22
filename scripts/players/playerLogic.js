class Player {
  constructor(
    order,
    name,
    money,
    hasStartMarker,
    bettingTickets,
    pyramidTickets,
    hasSpectator
  ) {
    this.order = order;
    this.name = name;
    this.money = money;
    this.hasStartMarker = hasStartMarker;
    this.bettingTickets = bettingTickets;
    this.pyramidTickets = pyramidTickets;
    this.hasSpectator = hasSpectator;
  }

  takeBettingTicket(color) {
    const betColorArray = allBettingTickets[color];
    if (betColorArray.length > 0) {
      const takenTicket = betColorArray.shift();
      this.bettingTickets.push(takenTicket);
      console.log(
        `${this.name} snagged a ${takenTicket.value} pound ${takenTicket.color} ticket`
      );
    } else {
      console.log("no tickets of this color are left");
    }
  }

  takePyramidTicket() {
    this.pyramidTickets += 1;
    console.log(
      `${this.name} snagged a pyramid ticket, now has ${this.pyramidTickets}`
    );
  }
}

const allPlayers = [
  new Player(1, "Austin", 3, true, [], 0, true),
  new Player(2, "Enemy", 3, false, [], 0, true),
];

let currentPlayer = allPlayers.find((p) => p.order === 1);
