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

let finishWinnerStack = [];
let finishLoserStack = [];

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

const resetFinishCards = () => {
  finishWinnerStack.length = 0;
  finishLoserStack.length = 0;
};

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

const countFinishCards = (isWinner) => {
  console.log(`${isWinner ? "winner" : "loser"} bets:`);
  const betSuccess = isWinner ? rankedCamels[0].color : rankedCamels[4].color;
  const finishBetValues = [8, 5, 3, 2];
  let finishBetIndex = 0;
  (isWinner ? finishWinnerStack : finishLoserStack).forEach((f) => {
    const owner = allPlayers.find((p) => p.name === f.playerName);
    if (f.color === betSuccess) {
      const finishWinnings = finishBetValues[finishBetIndex];
      console.log(
        `${owner.name} earned ${finishWinnings} for their bet on ${f.color}`
      );
      if (finishBetIndex < 4) {
        owner.money += finishWinnings;
        finishBetIndex += 1;
      } else {
        owner.money += 1;
      }
    } else {
      console.log(`${owner.name} lost 1 for their bet on ${f.color}`);
      owner.money -= 1;
    }
  });
};

const endRace = () => {
  raceOver = true;
  const winnerCamel = rankedCamels[0].color;
  const loserCamel = rankedCamels[4].color;
  console.log("race over");
  console.log(`winner: ${winnerCamel}`);
  console.log(`loser: ${loserCamel}`);
  countFinishCards(true);
  countFinishCards(false);
  promptResetGame();
};
