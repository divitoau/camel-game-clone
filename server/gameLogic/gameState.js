class BettingTicket {
  constructor(color, value) {
    this.color = color;
    this.value = value;
  }
}

class GameState {
  constructor() {
    this.raceStarted = false;
    this.raceOver = false;
    this.diceInPyramid = ["blue", "yellow", "green", "red", "purple", "grey"];
    this.diceOnTents = [];
    this.allCamels = [];
    this.rankedCamels = [];
    this.whiteCarryingRacer = false;
    this.blackCarryingRacer = false;
    this.whiteCarryingBlack = false;
    this.blackCarryingWhite = false;
    this.allPlayers = [];
    this.currentPlayerIndex;
    this.finishWinnerStack = [];
    this.finishLoserStack = [];
    this.remainingBettingTickets = this.initializeBettingTickets();
  }

  initializeBettingTickets() {
    return {
      blue: [
        new BettingTicket("blue", 5),
        new BettingTicket("blue", 3),
        new BettingTicket("blue", 2),
        new BettingTicket("blue", 2),
      ],
      yellow: [
        new BettingTicket("yellow", 5),
        new BettingTicket("yellow", 3),
        new BettingTicket("yellow", 2),
        new BettingTicket("yellow", 2),
      ],
      green: [
        new BettingTicket("green", 5),
        new BettingTicket("green", 3),
        new BettingTicket("green", 2),
        new BettingTicket("green", 2),
      ],
      red: [
        new BettingTicket("red", 5),
        new BettingTicket("red", 3),
        new BettingTicket("red", 2),
        new BettingTicket("red", 2),
      ],
      purple: [
        new BettingTicket("purple", 5),
        new BettingTicket("purple", 3),
        new BettingTicket("purple", 2),
        new BettingTicket("purple", 2),
      ],
    };
  }

  resetBettingTickets() {
    this.remainingBettingTickets = this.initializeBettingTickets();
  }

  resetFinishCards() {
    this.finishWinnerStack.length = 0;
    this.finishLoserStack.length = 0;
  }

  resetPyramid() {
    this.diceInPyramid = ["blue", "yellow", "green", "red", "purple", "grey"];
    this.diceOnTents.length = 0;
  }

  setRaceStarted(value) {
    this.raceStarted = value;
  }

  setRaceOver(value) {
    this.raceOver = value;
  }

  setWhiteCarryingRacer(value) {
    this.whiteCarryingRacer = value;
  }

  setBlackCarryingRacer(value) {
    this.blackCarryingRacer = value;
  }

  setWhiteCarryingBlack(value) {
    this.whiteCarryingBlack = value;
  }

  setBlackCarryingWhite(value) {
    this.blackCarryingWhite = value;
  }

  setCurrentPlayerIndex(value) {
    this.currentPlayerIndex = value;
  }

  getSpectatorTiles() {
    return this.allPlayers
      .filter((p) => p.spectatorTile.position > 1)
      .map((p) => p.spectatorTile);
  }

  hideFinishStack(isWinner) {
    const finishStack = isWinner
      ? this.finishWinnerStack
      : this.finishLoserStack;
    return finishStack.map((c) => c.playerName);
  }

  getGameState() {
    return {
      diceOnTents: this.diceOnTents,
      allCamels: this.allCamels,
      spectatorTiles: this.getSpectatorTiles(),
      finishWinnerStack: this.hideFinishStack(true),
      finishLoserStack: this.hideFinishStack(false),
      remainingBettingTickets: this.remainingBettingTickets,
    };
  }

  setCamels(camels) {
    this.allCamels = camels;
  }

  setPlayers(players) {
    this.allPlayers = players;
  }

  getRanking() {
    this.rankedCamels = this.allCamels
      .slice(0, 5)
      .sort((a, b) => {
        if (a.position === b.position) {
          return b.elevation - a.elevation;
        } else {
          return b.position - a.position;
        }
      })
      .map((camel) => camel.color);
  }

  getProhibitedSpaces() {
    const prohibitedSpaces = new Set([1]);
    this.allCamels.forEach((c) => {
      prohibitedSpaces.add(c.position);
    });
    const currentPlayer = this.allPlayers[this.currentPlayerIndex];
    this.allPlayers.forEach((p) => {
      if (p !== currentPlayer) {
        prohibitedSpaces.add(p.spectatorTile.position);
        prohibitedSpaces.add(p.spectatorTile.position + 1);
        prohibitedSpaces.add(p.spectatorTile.position - 1);
      }
    });
    return Array.from(prohibitedSpaces);
  }

  reset(isSamePlayers) {
    this.raceOver = false;
    if (!isSamePlayers) {
      this.raceStarted = false;
    }
    this.diceInPyramid = ["blue", "yellow", "green", "red", "purple", "grey"];
    this.diceOnTents = [];
    this.allCamels = [];
    this.rankedCamels = [];
    this.whiteCarryingRacer = false;
    this.blackCarryingRacer = false;
    this.whiteCarryingBlack = false;
    this.blackCarryingWhite = false;
    this.allPlayers = [];
    this.currentPlayerIndex;
    this.finishWinnerStack = [];
    this.finishLoserStack = [];
    this.remainingBettingTickets = this.initializeBettingTickets();
  }
}

const gameState = new GameState();

module.exports = gameState;
