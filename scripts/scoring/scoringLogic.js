const endLeg = () => {
  console.log(`leg leader: ${rankedCamels[0].color}`);
  console.log(`leg second: ${rankedCamels[1].color}`);
};

const endRace = () => {
  raceOver = true;
  console.log("race over");
  console.log(`winner: ${rankedCamels[0].color}`);
  console.log(`loser: ${rankedCamels[4].color}`);
  promptResetGame();
};
