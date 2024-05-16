class Camel {
  constructor(color, camelUnder, position) {
    this.color = color;
    this.camelUnder = camelUnder;
    this.position = position;
  }
  move(rollNumber) {
    this.position += rollNumber;
  }
}

const allCamels = [];

allCamels.push(new Camel("blue", null, null));
allCamels.push(new Camel("yellow", null, null));
allCamels.push(new Camel("green", null, null));
allCamels.push(new Camel("red", null, null));
allCamels.push(new Camel("purple", null, null));
allCamels.push(new Camel("white", null, null));
allCamels.push(new Camel("black", null, null));

const setStartingPositions = () => {
  for (let i = 0; i < 6; i++) {
    let spawnRoll = rollDie();
    if (!spawnRoll.color.startsWith("grey-")) {
      console.log(spawnRoll);
      const camel = allCamels.find((c) => c.color === spawnRoll.color);
      if (camel) camel.position = spawnRoll.number;
    }
  }
    
  const crazyRoll = selectFace();
  const crazyNumber = crazyRoll > 3 ? crazyRoll - 3 : crazyRoll;
  const crazyColor = crazyRoll > 3 ? "black" : "white";
  const crazyCamel = allCamels.find((c) => c.color === crazyColor);
  const otherCrazyColor = crazyColor === "white" ? "black" : "white";
  const otherCrazyCamel = allCamels.find((c) => c.color === otherCrazyColor);

  crazyCamel.position = 17 - crazyNumber;
  otherCrazyCamel.position = 17 - Math.ceil(Math.random() * 3);
  console.log(crazyCamel);
  console.log(otherCrazyCamel);
};

setStartingPositions();
