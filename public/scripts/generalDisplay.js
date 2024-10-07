const removeAllElements = (input) => {
  let elementToRemove;
  if (typeof input === "string" || input instanceof String) {
    document.querySelectorAll(input).forEach((el) => {
      el.remove();
    });
  } else if (input instanceof HTMLElement) {
    input.remove();
  }
};

const toggleOverlays = (turningOn) => {
  const overlays = document.querySelectorAll(".block-overlay");
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
