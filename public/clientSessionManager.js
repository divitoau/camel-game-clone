const setClientId = () => {
  const clientId = Math.floor(Math.random() * 1e8).toString();
  const expires = new Date(Date.now() + 864e5).toUTCString();
  document.cookie = `clientId=${clientId}; expires=${expires}; path=/`;
  return clientId;
};

const getClientId = () => {
  clientId = document.cookie
    .split("; ")
    .find((c) => c.startsWith("clientId="))
    ?.slice(9);
  return clientId;
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
