const handleSocket = (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Handle player disconnection
  });

  // Other socket event handlers
};

module.exports = { handleSocket };
