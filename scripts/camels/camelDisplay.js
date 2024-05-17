const displayCamels = () => {
  allCamels.forEach((camel) => {
    // creates an html element to represent a camel, assigns attributes, and appends to appropriate board space
    const camelFigure = document.createElement("div");
    camelFigure.className = `camel elevation-${camel.elevation}`;
    camelFigure.id = `${camel.color}-camel`;
    const startingSpace = document.getElementById(
      `track-space-${camel.position}`
    );
    startingSpace.appendChild(camelFigure);
  });
};

// moves camel figure to new appropriate board space
const displayNewPosition = (color) => {
  const camelFigure = document.getElementById(`${color}-camel`);
  const camel = allCamels.find((c) => c.color === color);
  const newSpace = document.getElementById(`track-space-${camel.position}`);
  camelFigure.className = `camel elevation-${camel.elevation}`;
  newSpace.appendChild(camelFigure);
};
