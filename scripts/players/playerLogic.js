class Player {
  constructor(id, money, hasStartMarker, bettingTickets, hasSpectator) {
    this.id = id;
    this.money = money;
    this.hasStartMarker = hasStartMarker;
    this.bettingTickets = bettingTickets;
    this.hasSpectator = hasSpectator;
  }

  takeBettingTicket(color) {
    const betColorArray = allBettingTickets[color];
    if (betColorArray.length > 0) {
      const takenTicket = betColorArray.shift();
      this.bettingTickets.push(takenTicket);
      console.log(
        `player ${this.id} snagged a ${takenTicket.value} pound ${takenTicket.color} ticket`
      );
    } else {
      console.log("no tickets of this color are left");
    }
  }
}

const player1 = new Player(1, 3, true, [], true);
