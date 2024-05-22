let whiteCarryingRacer = false;
let blackCarryingRacer = false;
let whiteCarryingBlack = false;
let blackCarryingWhite = false;
let raceOver = false;

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

    this.camelUnder = topCamel ? topCamel : null;
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
    displayNewPosition(this.color);
    getRanking();
    checkIfFinished(this);
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

let rankedCamels = [];

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
        camelsOnSpace.length > 0
          ? camelsOnSpace.find((c) => c.elevation === camelsOnSpace.length - 1)
          : null
      );
    }
  }

  getRanking();

  const crazyRoll = selectFace();
  const crazyNumber = crazyRoll > 3 ? crazyRoll - 3 : crazyRoll;
  const crazyColor = crazyRoll > 3 ? "black" : "white";
  const crazyCamel = allCamels.find((c) => c.color === crazyColor);
  const otherCrazyColor = crazyColor === "white" ? "black" : "white";
  const otherCrazyCamel = allCamels.find((c) => c.color === otherCrazyColor);
  const otherCrazyPosition = 17 - Math.ceil(Math.random() * 3);

  crazyCamel.setPosition(17 - crazyNumber, 0, null);
  otherCrazyCamel.setPosition(
    otherCrazyPosition,
    otherCrazyPosition === crazyCamel.position ? 1 : 0,
    otherCrazyPosition === crazyCamel.position ? crazyCamel : null
  );
  if (otherCrazyCamel.elevation === 1) {
    crazyColor === "white"
      ? (whiteCarryingBlack = true)
      : (blackCarryingWhite = true);
  }
};

const getRanking = () => {
  rankedCamels = allCamels.slice(0, 5).sort((a, b) => {
    if (a.position === b.position) {
      return b.elevation - a.elevation;
    } else {
      return b.position - a.position;
    }
  });
};

const checkIfFinished = (camel) => {
  if (camel.position > 16) {
    endLeg();
    endRace();
  } else if (camel.position < 1) {
    endLeg();
    endRace();
  }
};

setStartingPositions();
