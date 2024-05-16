const displayCamels = () => {
  allCamels.forEach((camel) => {
    const camelFigure = document.createElement("div");
    camelFigure.classList.add("camel", `elevation-${camel.elevation}`);
    camelFigure.setAttribute("id", `${camel.color}-camel`);
    const startingSpace = document.getElementById(
      `track-space-${camel.position}`
    );
    startingSpace.appendChild(camelFigure);
  });
};

const displayNewPosition = (color) => {
  const camelFigure = document.getElementById(`${color}-camel`);
  const camel = allCamels.find((c) => c.color === color);
  const newSpace = document.getElementById(`track-space-${camel.position}`);
  newSpace.appendChild(camelFigure);
};
