const gameState = require("./gameState");

const endLeg = () => {
  const legLeader = gameState.rankedCamels[0];
  const legSecond = gameState.rankedCamels[1];

  console.log(`leg leader: ${legLeader}`);
  console.log(`leg second: ${legSecond}`);

  gameState.allPlayers.forEach((p) => {
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
  const betSuccess = isWinner
    ? gameState.rankedCamels[0]
    : gameState.rankedCamels[4];
  const finishBetValues = [8, 5, 3, 2];
  let finishBetIndex = 0;
  (isWinner ? gameState.finishWinnerStack : gameState.finishLoserStack).forEach(
    (f) => {
      const owner = gameState.allPlayers.find((p) => p.name === f.playerName);
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
    }
  );
};

const endRace = () => {
  gameState.setRaceOver(true);
  const winnerCamel = gameState.rankedCamels[0];
  const loserCamel = gameState.rankedCamels[4];
  console.log("race over");
  console.log(`winner: ${winnerCamel}`);
  console.log(`loser: ${loserCamel}`);
  countFinishCards(true);
  countFinishCards(false);
  promptResetGame();
};

module.exports = { endLeg, endRace };
