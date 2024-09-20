const overlays = document.querySelectorAll(".block-overlay");

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

const toggleOverlays = (turningOn) => {
  overlays.forEach((o) => (o.style.display = turningOn ? "block" : "none"));
};

//***** consider simplifying
const closeDialogsExcept = (exception) => {
  const allDialogs = [
    legSummaryDialog,
    gameStartDialog,
    spectatorDialog,
    finalSummaryDialog,
  ];
  allDialogs.forEach((d) => {
    if (d.hasAttribute("open") && d !== exception) {
      d.close();
    }
  });
};
