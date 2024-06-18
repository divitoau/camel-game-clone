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
  removeAllElements(".leg-bet-stack li");
  for (const color in tickets) {
    if (tickets[color].length > 0) {
      tickets[color].forEach((t) => {
        const ticketElement = document.createElement("li");
        const stackElement = document.getElementById(`${t.color}-leg-bets`);
        ticketElement.className = t.color;
        ticketElement.textContent = t.value;
        stackElement.appendChild(ticketElement);
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
