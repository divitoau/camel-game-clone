const finishWinnerContainer = document.getElementById(
  "finish-winner-container"
);
const finishLoserContainer = document.getElementById("finish-loser-container");

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
    if (tickets[color].length > 0) {
      const stackElement = document.getElementById(`${color}-leg-bets`);
      stackElement.innerHTML = "";
      tickets[color].reverse().forEach((t) => {
        stackElement.innerHTML += `
          <div class="game-card leg-bet-card">
            <p class="leg-bet-value ${t.color}">${t.value}</p>
            <img
              class="card-camel ${t.color}-card-camel"
              src="images/camel.svg"
              alt="a ${t.color} camel"
            />
          </div>`;
        stackElement.addEventListener("click", () =>
          takeBettingTicket(t.color)
        );
      });
    }
  }
};

const displayFinishStack = (isWinner, finishStack) => {
  removeAllElements(
    isWinner ? "#finish-winner-stack li" : "#finish-loser-stack li"
  );
  finishStack.forEach((c) => {
    const cardElement = document.createElement("li");
    const stackElement = document.getElementById(
      isWinner ? "finish-winner-stack" : "finish-loser-stack"
    );
    cardElement.textContent = c;
    stackElement.appendChild(cardElement);
  });
};
