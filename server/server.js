const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const indexRouter = require("./index.js");
const { handleSocket } = require("./socketHandler");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static("public"));
app.use("/", indexRouter);

io.on("connection", handleSocket);

const port = process.env.PORT || 8080;
server.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
