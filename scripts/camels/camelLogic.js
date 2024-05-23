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

    let goesUnder = false;

    allPlayers.forEach((p) => {
      if (p.spectatorTile.position === newPosition) {
        console.log(`${p.name}'s cash was: ${p.money}`);
        p.money += 1;
        console.log(`${p.name}'s cash now: ${p.money}`);
        if (p.spectatorTile.isCheering) {
          if (this.color !== "white" && this.color !== "black") {
            newPosition += 1;
          } else {
            newPosition -= 1;
          }
          console.log(`${this.color} got bumped up 1`);
        } else {
          goesUnder = true;
          if (this.color !== "white" && this.color !== "black") {
            newPosition -= 1;
          } else {
            newPosition += 1;
          }
          console.log(`${this.color} got bumped back 1`);
        }
      }
    });

    const camelsAbove = allCamels.filter(
      (c) => c.position === this.position && c.elevation > this.elevation
    );
    const camelsOnSpace = allCamels.filter((c) => c.position === newPosition);

    if (goesUnder) {
      camelsOnSpace.forEach((cos) => {
        if (cos.elevation === 0) {
          if (camelsAbove.length > 0) {
            cos.camelUnder = camelsAbove.find((c) => {
              c.elevation - this.elevation === camelsAbove.length;
            });
          } else {
            cos.camelUnder = this;
          }
        }
        cos.elevation += camelsAbove.length + 1;
        displayNewPosition(cos.color);
      });
      if (camelsAbove.length > 0) {
        camelsAbove.forEach((ca) => {
          ca.position = newPosition;
          ca.elevation -= this.elevation;
          displayNewPosition(ca.color);
        });
      }
      this.camelUnder = null;
      this.elevation = 0;
    } else {
      const topCamel = camelsOnSpace.find(
        (c) => c.elevation === camelsOnSpace.length - 1
      );

      if (camelsAbove.length > 0) {
        camelsAbove.forEach((c) => {
          c.position = newPosition;
          c.elevation = camelsOnSpace.length + (c.elevation - this.elevation);
          displayNewPosition(c.color);
        });
      }

      this.camelUnder = topCamel ? topCamel : null;
      this.elevation = camelsOnSpace.length;
    }

    this.position = newPosition;

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
