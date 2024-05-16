const displayCamels = () => {
  allCamels.forEach((camel) => {
    const camelFigure = document.createElement("div");
    camelFigure.classList.add("camel", `elevation-${camel.elevation}`);
    camelFigure.setAttribute("id", `${camel.color}-camel`);
    const startingSpace = document.getElementById(
      `track-space-${camel.position}`
    );
    startingSpace.appendChild(camelFigure);
  });
};

//           <div class="camel" id="yellow-camel"></div>
