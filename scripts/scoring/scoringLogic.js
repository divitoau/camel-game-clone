class BettingTicket {
  constructor(color, value) {
    (this.color = color), (this.value = value);
  }
}

let allBettingTickets = {
  blue: [
    new BettingTicket("blue", 5),
    new BettingTicket("blue", 3),
    new BettingTicket("blue", 2),
    new BettingTicket("blue", 2),
  ],
  yellow: [
    new BettingTicket("yellow", 5),
    new BettingTicket("yellow", 3),
    new BettingTicket("yellow", 2),
    new BettingTicket("yellow", 2),
  ],
  green: [
    new BettingTicket("green", 5),
    new BettingTicket("green", 3),
    new BettingTicket("green", 2),
    new BettingTicket("green", 2),
  ],
  red: [
    new BettingTicket("red", 5),
    new BettingTicket("red", 3),
    new BettingTicket("red", 2),
    new BettingTicket("red", 2),
  ],
  purple: [
    new BettingTicket("purple", 5),
    new BettingTicket("purple", 3),
    new BettingTicket("purple", 2),
    new BettingTicket("purple", 2),
  ],
};

const endLeg = () => {
  const legLeader = rankedCamels[0].color;
  const legSecond = rankedCamels[1].color;
  let legBetMoney = 0;

  currentPlayer.bettingTickets.forEach((t) => {
    if (t.color === legLeader) {
      legBetMoney += t.value;
    } else if (t.color === legSecond) {
      legBetMoney += 1;
    } else {
      legBetMoney -= 1;
    }
  });

  console.log(`leg leader: ${legLeader}`);
  console.log(`leg second: ${legSecond}`);
  console.log(`money from bets: ${legBetMoney}`);
  console.log(`money from pyramid: ${currentPlayer.pyramidTickets}`);

  const legNet = legBetMoney + currentPlayer.pyramidTickets;
  console.log(`money net: ${legNet}`);
};

const endRace = () => {
  raceOver = true;
  console.log("race over");
  console.log(`winner: ${rankedCamels[0].color}`);
  console.log(`loser: ${rankedCamels[4].color}`);
  promptResetGame();
};
