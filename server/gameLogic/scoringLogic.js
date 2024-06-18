const gameState = require("./gameState");

const calculateLeg = (name) => {
  const legLeader = gameState.rankedCamels[0];
  const legSecond = gameState.rankedCamels[1];

  const player = gameState.allPlayers.find((p) => p.name === name);

  const legPyramidMoney = player.pyramidTickets;

  let legBetMoney = 0;
  player.bettingTickets.forEach((t) => {
    if (t.color === legLeader) {
      legBetMoney += t.value;
    } else if (t.color === legSecond) {
      legBetMoney += 1;
    } else {
      legBetMoney -= 1;
    }
  });

  player.resolveLeg(player.money + legBetMoney + legPyramidMoney);

  return { legBetMoney, legPyramidMoney };
};

const countFinishCards = (isWinner) => {
  const betSuccess = gameState.rankedCamels[isWinner ? 0 : 4];
  const finishBetValues = [8, 5, 3, 2];
  let finishBetIndex = 0;
  const finishCardScores = (
    isWinner ? gameState.finishWinnerStack : gameState.finishLoserStack
  ).map((f) => {
    const owner = gameState.allPlayers.find((p) => p.name === f.playerName);
    if (f.color === betSuccess) {
      const finishWinnings = finishBetValues[finishBetIndex];
      if (finishBetIndex < 4) {
        owner.money += finishWinnings;
        finishBetIndex += 1;
        return {
          owner: owner.name,
          color: f.color,
          reward: finishWinnings,
        };
      } else {
        owner.money += 1;
        return {
          owner: owner.name,
          color: f.color,
          reward: 1,
        };
      }
    } else {
      owner.money -= 1;
      return {
        owner: owner.name,
        color: f.color,
        reward: -1,
      };
    }
  });
  return finishCardScores;
};

module.exports = { calculateLeg, countFinishCards };
