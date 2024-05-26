const {
  rollDie,
  resetPyramid,
  selectFace,
  getWhiteCarryingRacer,
  getBlackCarryingRacer,
  getWhiteCarryingBlack,
  getBlackCarryingWhite,
  setWhiteCarryingRacer,
  setBlackCarryingRacer,
  setWhiteCarryingBlack,
  setBlackCarryingWhite,
} = require("./diceLogic");

// this file contains the logic for the movement of the camels

let raceOver = false;

let rankedCamels = [];

class Camel {
  constructor(color, position, elevation, camelUnder) {
    this.color = color;
    this.position = position;
    this.elevation = elevation;
    this.camelUnder = camelUnder;
  }

  move(rollNumber) {
    let newPosition;

    // determine which direction camel should be moving
    if (this.color === "white" || this.color === "black") {
      newPosition = this.position - rollNumber;
    } else {
      newPosition = this.position + rollNumber;

      // check if a camel is getting off of black or white
      if (this.camelUnder?.color === "white") {
        setWhiteCarryingRacer(false);
      }
      if (this.camelUnder?.color === "black") {
        setBlackCarryingRacer(false);
      }
    }

    // this variable determines stacking order of the new space
    let goesUnder = false;

    // checks if camel landed on spectator tile
    allPlayers.forEach((p) => {
      if (p.spectatorTile.position === newPosition) {
        // pays tile owner
        p.money += 1;
        console.log(
          `${p.name} got money from spectator tile, now has ${p.money}`
        );

        // moves camel foreward if cheering
        if (p.spectatorTile.isCheering) {
          if (this.color !== "white" && this.color !== "black") {
            newPosition += 1;
          } else {
            newPosition -= 1;
          }
          console.log(`${this.color} got bumped up 1`);
        } else {
          // moves camel backward if booing and switches stacking order
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

    // generates array of all camels above the moving camel
    const camelsAbove = allCamels.filter(
      (c) => c.position === this.position && c.elevation > this.elevation
    );

    // generates array of all camels on the new space
    const camelsOnSpace = allCamels.filter((c) => c.position === newPosition);

    if (goesUnder) {
      // raises elevation so moving camels can be stacked under current camels
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
      // resolves position of camels riding the moving camel if group is going under
      camelsAbove.forEach((ca) => {
        ca.position = newPosition;
        ca.elevation -= this.elevation;
        displayNewPosition(ca.color);
      });

      // places moving camel on bottom
      this.camelUnder = null;
      this.elevation = 0;
    } else {
      // finds top camel on new space
      const topCamel = camelsOnSpace.find(
        (c) => c.elevation === camelsOnSpace.length - 1
      );

      // resolves position of camels riding the moving camel if group is going above
      camelsAbove.forEach((c) => {
        c.position = newPosition;
        c.elevation = camelsOnSpace.length + (c.elevation - this.elevation);
        displayNewPosition(c.color);
      });

      // places moving camel
      this.camelUnder = topCamel ? topCamel : null;
      this.elevation = camelsOnSpace.length;
    }

    this.position = newPosition;

    // logic for determing whether black or white are currently being ridden
    if (this.color === "white") {
      setBlackCarryingRacer(this.camelUnder?.color === "black");
    } else if (this.color === "black") {
      setWhiteCarryingRacer(this.camelUnder?.color === "white");
    } else {
      if (this.camelUnder?.color === "white") {
        setWhiteCarryingRacer(true);
      }
      if (this.camelUnder?.color === "black") {
        setBlackCarryingRacer(true);
      }
    }

    // update dom, check rankings and if anyone's crossed finish
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

const setStartingPositions = () => {
  // roll all dice to determine the starting positions of the racers
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

  // put dice back
  resetPyramid();

  // so that starting ranking is known in case i ever try to write a computer player
  getRanking();

  // roll two dice to determine the start position of the crazy camels
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
      ? setWhiteCarryingRacer(true)
      : setBlackCarryingRacer(true);
  }
};

// generate an array of the racers ordered by position then elevation, descending
const getRanking = () => {
  rankedCamels = allCamels.slice(0, 5).sort((a, b) => {
    if (a.position === b.position) {
      return b.elevation - a.elevation;
    } else {
      return b.position - a.position;
    }
  });
};

// check if a camel has crossed finish (in either direction)
const checkIfFinished = (camel) => {
  if (camel.position > 16) {
    endLeg();
    endRace();
  } else if (camel.position < 1) {
    endLeg();
    endRace();
  }
};

module.exports = {
  allCamels,
  setStartingPositions,
};