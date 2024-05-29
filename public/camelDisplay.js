const displayCamels = (allCamels) => {
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

const removeCamels = () => {
  allCamels.forEach((camel) => {
    const camelFigure = document.getElementById(`${camel.color}-camel`);
    camelFigure.remove();
  });
};

// moves camel figure to new appropriate board space
const displayNewPosition = (allCamels) => {
  allCamels.forEach((c) => {
    const camelFigure = document.getElementById(`${c.color}-camel`);
    let newSpaceNumber;
    if (c.position > 16) {
      newSpaceNumber = c.position - 16;
    } else if (c.position < 1) {
      newSpaceNumber = 16 + c.position;
    } else {
      newSpaceNumber = c.position;
    }
    const newSpace = document.getElementById(`track-space-${newSpaceNumber}`);
    camelFigure.className = `camel elevation-${c.elevation}`;
    newSpace.appendChild(camelFigure);
  });
};
