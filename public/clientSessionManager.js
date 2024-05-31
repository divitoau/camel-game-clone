const setPlayerId = () => {
  const playerId = Math.floor(Math.random() * 1e8).toString();
  const expires = new Date(Date.now() + 864e5).toUTCString();
  document.cookie = `playerId=${playerId}; expires=${expires}; path=/`;
  return playerId;
};

const getPlayerId = () => {
  playerId = document.cookie
    .split("; ")
    .find((c) => c.startsWith("playerId="))
    ?.slice(9);
  return playerId;
};

const setIsGameHost = (isHost) => {
  const expires = new Date(Date.now() + 864e5).toUTCString();
  document.cookie = `isGameHost=${isHost}; expires=${expires}; path=/`;
};

const getIsGameHost = () => {
  isGameHostStr = document.cookie
    .split("; ")
    .find((c) => c.startsWith("isGameHost="))
    ?.slice(11);
  return isGameHostStr === "true";
};
