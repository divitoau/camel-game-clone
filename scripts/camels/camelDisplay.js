const displayCamels = () => {
  document.querySelector(".camel") === null
    ? allCamels.forEach((camel) => {
        // creates an html element to represent a camel, assigns attributes, and appends to appropriate board space
        const camelFigure = document.createElement("div");
        camelFigure.className = `camel elevation-${camel.elevation}`;
        camelFigure.id = `${camel.color}-camel`;
        const startingSpace = document.getElementById(
          `track-space-${camel.position}`
        );
        startingSpace.appendChild(camelFigure);
      })
    : console.log("stop pressing that");
};

// moves camel figure to new appropriate board space
const displayNewPosition = (color) => {
  const camelFigure = document.getElementById(`${color}-camel`);
  const camel = allCamels.find((c) => c.color === color);
  let newSpaceNumber;
  if (camel.position > 16) {
    newSpaceNumber = camel.position - 16;
  } else if (camel.position < 1) {
    newSpaceNumber = 16 + camel.position;
  } else {
    newSpaceNumber = camel.position;
  }
  const newSpace = document.getElementById(`track-space-${newSpaceNumber}`);
  camelFigure.className = `camel elevation-${camel.elevation}`;
  newSpace.appendChild(camelFigure);
};
