const scoreBoard = document.getElementById("scoreboard");

const createScoreboard = (playerNames) => {
  let htmlContent = "";
  playerNames.forEach((n) => {
    htmlContent += `
<div class="opp-nameplate" id="${n}-nameplate">
  <span class="opp-name">${n}</span>
  <span class="opp-gold-container">
    <img class="gold-logo" src="images/gold.svg" alt="a pile of gold coins" />
    <span class="opp-gold-count">3</span>
  </span>
  <div class="opp-inventory">
    <div class="opp-pyramid-ticket-container"></div>
    <div class="opp-spectator-tile-container">
      <img class="thumb" src="images/thumb.svg" alt="a thumb" />
    </div>
    <div class="opp-betting-ticket-container"></div>
    <div class="opp-finish-ticket-container">
      <span class="opp-finish-ticket">F</span>
      <span class="opp-finish-ticket">F</span>
      <span class="opp-finish-ticket">F</span>
      <span class="opp-finish-ticket">F</span>
      <span class="opp-finish-ticket">F</span>
    </div>
  </div>
</div>`;
  });
  scoreBoard.innerHTML = htmlContent;
};

const updateScoreboard = (otherPlayers) => {
  otherPlayers.forEach((p) => {
    const pyramidTicketContainer = document.querySelector(
      `#${p.name}-nameplate .opp-pyramid-ticket-container`
    );
    let pyramidTicketHtml = "";
    for (let i = 0; i < p.pyramidTickets; i++) {
      pyramidTicketHtml += `
  <img
    class="pyramid-ticket"
    src="images/pyramidToken.svg"
    alt="a square with the letter P"
  />;`;
    }
    pyramidTicketContainer.innerHTML = pyramidTicketHtml;

    // ****** do the rest like such
  });
};
