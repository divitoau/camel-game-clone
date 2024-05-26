const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const indexRouter = require("./index.js");

const { allCamels, setStartingPositions } = require("./gameLogic/camelLogic");
const {
  allPlayers,
  playerNames,
  getCurrentPlayer,
  addPlayer,
  generatePlayers,
} = require("./gameLogic/playerLogic");
/* const { allCamels } = require("./gameLogic/camelLogic");
 */

const app = express();
const server = createServer(app);
const io = new Server(server);

const getCurrentState = () => {
  const currentPlayer = getCurrentPlayer()
  const currentState = { allCamels, playerNames, allPlayers, currentPlayer };
  return currentState;
};

app.use(express.static("public"));
app.use("/", indexRouter);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.emit("fullState", getCurrentState());

  socket.on("newPlayer", (newPlayer) => {
    socket.emit("newPlayerRes", addPlayer(newPlayer), playerNames);
  });

  socket.on("startGame", () => {
    generatePlayers();
    setStartingPositions();
    socket.emit("startGameRes", getCurrentState());
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const port = process.env.PORT || 8080;
server.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
