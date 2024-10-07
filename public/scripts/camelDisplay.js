const displayCamels = (allCamels) => {
  allCamels.forEach((camel) => {
    // creates an html element to represent a camel, assigns attributes, and appends to appropriate board space
    const startingSpace = document.getElementById(
      `track-space-${camel.position}`
    );
    startingSpace.innerHTML += `
      <img
        id="${camel.color}-camel-piece"
        class="camel-piece elevation-${camel.elevation} ${camel.color}-camel"
        src="images/camel.svg"
        alt="a ${camel.color} camel"
      />`;
  });
};

const removeCamels = (allCamels) => {
  allCamels.forEach((camel) => {
    removeAllElements(`#${camel.color}-camel-piece`);
  });
};

// moves camel figure to new appropriate board space
const displayNewPosition = (allCamels) => {
  allCamels.forEach((c) => {
    const camelFigure = document.getElementById(`${c.color}-camel-piece`);
    let newSpaceNumber;
    if (c.position > 16) {
      newSpaceNumber = c.position - 16;
    } else if (c.position < 1) {
      newSpaceNumber = 16 + c.position;
    } else {
      newSpaceNumber = c.position;
    }
    const newSpace = document.getElementById(`track-space-${newSpaceNumber}`);
    camelFigure.className = `camel-piece elevation-${c.elevation} ${c.color}-camel`;
    newSpace.appendChild(camelFigure);
  });
};
