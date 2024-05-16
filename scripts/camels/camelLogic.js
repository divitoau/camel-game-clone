class Camel {
  constructor(color, position, elevation, camelUnder) {
    this.color = color;
    this.position = position;
    this.elevation = elevation;
    this.camelUnder = camelUnder;
  }

  move(rollNumber) {
    this.position += rollNumber;
  }

  setStartingPosition(position, elevation, camelUnder) {
    this.position = position;
    this.elevation = elevation;
    this.camelUnder = camelUnder;
  }
}

const allCamels = [
  new Camel("blue"),
  new Camel("yellow"),
  new Camel("green"),
  new Camel("red"),
  new Camel("purple"),
  new Camel("white"),
  new Camel("black"),
];

const setStartingPositions = () => {
  for (let i = 0; i < 6; i++) {
    let spawnRoll = rollDie();
    if (!spawnRoll.color.startsWith("grey-")) {
      const camel = allCamels.find((c) => c.color === spawnRoll.color);
      const camelsOnSpace = allCamels.filter(
        (c) => c.position === spawnRoll.number
      );
      camel.setStartingPosition(
        spawnRoll.number,
        camelsOnSpace.length,
        camelsOnSpace.find((c) => c.elevation === camelsOnSpace.length - 1)
      );
    }
  }

  const crazyRoll = selectFace();
  const crazyNumber = crazyRoll > 3 ? crazyRoll - 3 : crazyRoll;
  const crazyColor = crazyRoll > 3 ? "black" : "white";
  const crazyCamel = allCamels.find((c) => c.color === crazyColor);
  const otherCrazyColor = crazyColor === "white" ? "black" : "white";
  const otherCrazyCamel = allCamels.find((c) => c.color === otherCrazyColor);
  const occPosition = 17 - Math.ceil(Math.random() * 3);

  crazyCamel.setStartingPosition(17 - crazyNumber, 0);
  otherCrazyCamel.setStartingPosition(
    occPosition,
    occPosition === crazyCamel.position ? 1 : 0,
    occPosition === crazyCamel.position ? crazyCamel : undefined
  );
};

setStartingPositions();
allCamels.forEach((camel) => console.log(camel));
