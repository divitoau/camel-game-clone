const displayDice = (dice) => {
  dice.forEach((d) => {
    const tentNumber = dice.indexOf(d) + 1;
    let tent = document.getElementById(`tent-${tentNumber}`);
    tent.className = `dice-tent ${d.color}-die`;
    tent.innerHTML = `<p>${d.number}</p>`;
  });
};

const resetTents = () => {
  document.querySelectorAll(".dice-tent").forEach((tent) => {
    tent.className = "dice-tent";
    tent.innerHTML = "<p> </p>";
  });
};

const displayBettingTickets = (tickets) => {
  for (const color in tickets) {
    const stackElement = document.getElementById(`${color}-leg-bets`);
    stackElement.innerHTML = "";
    if (tickets[color].length > 0) {
      if (
        stackElement &&
        !stackElement.hasAttribute("betting-ticket-listener")
      ) {
        stackElement.addEventListener("click", () => {
          removeAllElements(".place-button");
          removeAllElements(".finish-button");
          replaceSpectatorTile();
          takeBettingTicket(color);
        });
        stackElement.setAttribute("betting-ticket-listener", "true");
      }
      tickets[color].reverse().forEach((t) => {
        stackElement.innerHTML += `
          <div class="game-card leg-bet-card ${color}-leg-bet-card">
            <p class="leg-bet-value ${color}">${t.value}</p>
            <img
              class="card-camel ${color}-camel"
              src="images/camel.svg"
              alt="a ${color} camel"
            />
          </div>`;
      });
    }
  }
};

const displayFinishStack = (isWinner, finishStack) => {
  const stackElement = document.getElementById(
    `finish-${isWinner ? "winner" : "loser"}-stack`
  );
  stackElement.innerHTML = "";
  finishStack.forEach((n) => {
    stackElement.innerHTML += `
      <div class="game-card finish-card">
        <p class="card-player">${n}</p>
      </div>`;
  });
};
