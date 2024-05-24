class BettingTicket {
  constructor(color, value) {
    this.color = color;
    this.value = value;
  }
}

class FinishCard {
  constructor(color, playerName) {
    this.color = color;
    this.playerName = playerName;
  }
}

const allBettingTickets = {
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

let remainingBettingTickets;

const resetBettingTickets = () => {
  remainingBettingTickets = JSON.parse(JSON.stringify(allBettingTickets));
};

resetBettingTickets();

const endLeg = () => {
  const legLeader = rankedCamels[0].color;
  const legSecond = rankedCamels[1].color;

  console.log(`leg leader: ${legLeader}`);
  console.log(`leg second: ${legSecond}`);

  allPlayers.forEach((p) => {
    const legPyramidMoney = p.pyramidTickets;

    let legBetMoney = 0;
    p.bettingTickets.forEach((t) => {
      if (t.color === legLeader) {
        legBetMoney += t.value;
      } else if (t.color === legSecond) {
        legBetMoney += 1;
      } else {
        legBetMoney -= 1;
      }
    });

    console.log(p.name);
    console.log(`money from bets: ${legBetMoney}`);
    console.log(`money from pyramid: ${legPyramidMoney}`);

    const legNet = legBetMoney + legPyramidMoney;
    p.resolveLeg(p.money + legNet);

    console.log(`money net: ${legNet}`);
    console.log(`total money: ${p.money}`);
  });
};

const endRace = () => {
  raceOver = true;
  console.log("race over");
  console.log(`winner: ${rankedCamels[0].color}`);
  console.log(`loser: ${rankedCamels[4].color}`);
  promptResetGame();
};
