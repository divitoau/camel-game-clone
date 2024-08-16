const removeAllElements = (elementString) => {
  document.querySelectorAll(elementString).forEach((b) => {
    b.remove();
  });
};

const checkAndRemove = (input) => {
  let elementToRemove;
  if (typeof input === "string" || input instanceof String) {
    elementToRemove = document.getElementById(input);
  } else if (input instanceof HTMLElement) {
    elementToRemove = input;
  }
  if (document.contains(elementToRemove)) {
    elementToRemove.remove();
    return true;
  } else {
    return false;
  }
};

const closeDialogsExcept = (exception) => {
  const allDialogs = [
    legSummaryDialog,
    gameStartDialog,
    spectatorDialog,
    legBetDialog,
    finishBetDialog,
    finalSummaryDialog,
  ];
  allDialogs.forEach((d) => {
    if (d.hasAttribute("open") && d !== exception) {
      d.close();
    }
  });
};
