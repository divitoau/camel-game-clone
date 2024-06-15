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
