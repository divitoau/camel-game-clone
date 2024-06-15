const legSummaryDialog = document.getElementById("leg-summary-dialog");
const legSummaryButton = document.getElementById("leg-summary-button");
const legSummaryDisplay = document.getElementById("leg-summary-display");

legSummaryButton.addEventListener("click", () => {
  legSummaryDialog.close();
  resetTents();
  removeAllElements(".spectator-tile");
});

const displayLegResults = (legResults) => {
  legSummaryDialog.showModal();
  legSummaryDisplay.innerHTML = `<p>Money from bets: ${legResults.legBetMoney}</p><p>Money from pyramid tickets: ${legResults.legPyramidMoney}</p>`;
};
