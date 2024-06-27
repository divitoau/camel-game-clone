const legSummaryDialog = document.getElementById("leg-summary-dialog");
const legSummaryButton = document.getElementById("leg-summary-button");
const legSummaryDisplay = document.getElementById("leg-summary-display");

const finalSummaryDialog = document.getElementById("final-summary-dialog");
const finalSummaryButton = document.getElementById("final-summary-button");
const finalSummaryDisplay = document.getElementById("final-summary-display");
const finalWinnerBets = document.getElementById("final-winner-bets");
const finalLoserBets = document.getElementById("final-loser-bets");
const totalRewards = document.getElementById("total-rewards");
const playerRanking = document.getElementById("player-ranking");

legSummaryButton.addEventListener("click", () => {
  legSummaryDialog.close();
});

finalSummaryButton.addEventListener("click", () => {
  finalSummaryDialog.close();
  resetTents();
  removeAllElements(".spectator-tile");
});

const displayLegResults = (legResults) => {
  legSummaryDialog.showModal();
  legSummaryDisplay.innerHTML = `<p>Money from bets: ${legResults.legBetMoney}</p><p>Money from pyramid tickets: ${legResults.legPyramidMoney}</p>`;
};

const displayFinalLeg = (finalResults) => {
  const proceedButton = document.createElement("button");
  proceedButton.innerText = "Proceed to final results";
  proceedButton.addEventListener("click", () => {
    displayFinalResults();
  });
  legSummaryButton.remove();
  legSummaryDialog.appendChild(proceedButton);
  legSummaryDialog.showModal();
  legSummaryDisplay.innerHTML = `<p>Money from bets: ${finalResults.legBetMoney}</p><p>Money from pyramid tickets: ${finalResults.legPyramidMoney}</p>`;
};

const displayFinalResults = () => {
  legSummaryDialog.close();
  finalSummaryDialog.showModal();
};

const updateFinalSummary = (
  winnerCardScores,
  loserCardScores,
  totalFinishRewards,
  rankedPlayers
) => {
  winnerCardScores.forEach(({ owner, color, reward }) => {
    const card = document.createElement("li");
    card.innerText = `${owner} bet on ${color}, ${
      reward > 0 ? `received ${reward} gold` : "lost 1 gold"
    }`;
    finalWinnerBets.appendChild(card);
  });
  loserCardScores.forEach(({ owner, color, reward }) => {
    const card = document.createElement("li");
    card.innerText = `${owner} bet on ${color}, ${
      reward > 0 ? `received ${reward} gold` : "lost 1 gold"
    }`;
    finalLoserBets.appendChild(card);
  });
  const rewardCount = document.createElement("p");
  rewardCount.innerText = totalFinishRewards;
  totalRewards.appendChild(rewardCount);
  rankedPlayers.forEach(({ name, money }) => {
    const player = document.createElement("li");
    player.innerText = `${name} | ${money}`;
    playerRanking.appendChild(player);
  });
};
