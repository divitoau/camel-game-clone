const scoreBoard = document.getElementById("scoreboard");

const createScoreboard = (playerNames) => {
  let htmlContent = "";
  playerNames.forEach((n) => {
    htmlContent += `
      <div class="opp-nameplate" id="${n}-nameplate">
        <span class="opp-name">${n}</span>
        <span class="opp-gold-container">
          <img class="gold-logo" src="images/gold.svg" alt="a pile of gold coins" />
          <span class="opp-gold-count"></span>
        </span>
        <div class="opp-inventory">
          <div class="opp-pyramid-ticket-container"></div>
          <div class="opp-spectator-tile-container"></div>
          <div class="opp-betting-ticket-container"></div>
          <div class="opp-finish-card-container"></div>
        </div>
      </div>`;
  });
  scoreBoard.innerHTML = htmlContent;
};

const updateScoreboard = (otherPlayers) => {
  otherPlayers.forEach((p) => {
    const goldCount = document.querySelector(
      `#${p.name}-nameplate .opp-gold-count`
    );
    goldCount.textContent = p.money;

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
        />`;
    }
    pyramidTicketContainer.innerHTML = pyramidTicketHtml;

    const spectatorTileContainer = document.querySelector(
      `#${p.name}-nameplate .opp-spectator-tile-container`
    );
    let spectatorTileHtml = "";
    if (p.spectatorTile.position === null) {
      spectatorTileHtml += `
        <img
          class="thumb"
          src="images/thumb.svg"
          alt="a thumb"
        />`;
    }
    spectatorTileContainer.innerHTML = spectatorTileHtml;

    const bettingTicketContainer = document.querySelector(
      `#${p.name}-nameplate .opp-betting-ticket-container`
    );
    let bettingTicketHtml = "";
    p.bettingTickets.forEach((t) => {
      bettingTicketHtml += `
        <span class="opp-betting-ticket ${t.color}-ticket">${t.value}</span>`;
    });
    bettingTicketContainer.innerHTML = bettingTicketHtml;

    const finishCardContainer = document.querySelector(
      `#${p.name}-nameplate .opp-finish-card-container`
    );
    let finishCardHtml = "";
    for (let i = 0; i < p.finishCards; i++) {
      finishCardHtml += `
        <span class="opp-finish-card">F</span>`;
    }
    finishCardContainer.innerHTML = finishCardHtml;
  });
};
