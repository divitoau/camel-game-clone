let whiteCarryingRacer = false;
let blackCarryingRacer = false;
let whiteCarryingBlack = false;
let blackCarryingWhite = false;

class Camel {
  constructor(color, position, elevation, camelUnder) {
    this.color = color;
    this.position = position;
    this.elevation = elevation;
    this.camelUnder = camelUnder;
  }

  move(rollNumber) {
    let newPosition;
    if (this.color === "white" || this.color === "black") {
      newPosition = this.position - rollNumber;
    } else {
      newPosition = this.position + rollNumber;
      if (this.camelUnder?.color === "white") {
        whiteCarryingRacer = false;
      }
      if (this.camelUnder?.color === "black") {
        blackCarryingRacer = false;
      }
    }

    const camelsOnSpace = allCamels.filter((c) => c.position === newPosition);
    const topCamel = camelsOnSpace.find(
      (c) => c.elevation === camelsOnSpace.length - 1
    );
    const camelsAbove = allCamels.filter(
      (c) => c.position === this.position && c.elevation > this.elevation
    );

    if (camelsAbove.length > 0) {
      camelsAbove.forEach((c) => {
        c.position = newPosition;
        c.elevation = camelsOnSpace.length + (c.elevation - this.elevation);
        displayNewPosition(c.color);
      });
    }

    this.camelUnder = topCamel;
    this.position = newPosition;
    this.elevation = camelsOnSpace.length;

    if (this.color === "white") {
      blackCarryingWhite = this.camelUnder?.color === "black" ? true : false;
    } else if (this.color === "black") {
      whiteCarryingBlack = this.camelUnder?.color === "white" ? true : false;
    } else {
      if (this.camelUnder?.color === "white") {
        whiteCarryingRacer = true;
      }
      if (this.camelUnder?.color === "black") {
        blackCarryingRacer = true;
      }
    }
  }

  setPosition(position, elevation, camelUnder) {
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
      camel.setPosition(
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

  crazyCamel.setPosition(17 - crazyNumber, 0);
  otherCrazyCamel.setPosition(
    occPosition,
    occPosition === crazyCamel.position ? 1 : 0,
    occPosition === crazyCamel.position ? crazyCamel : undefined
  );
  if (otherCrazyCamel.elevation === 1) {
    crazyColor === "white"
      ? (whiteCarryingBlack = true)
      : (blackCarryingWhite = true);
  }
};

setStartingPositions();
allCamels.forEach((camel) => console.log(camel));
