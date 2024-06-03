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
