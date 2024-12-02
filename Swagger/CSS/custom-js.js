const fn = () => {
  const h2Title = document.querySelector(".title");

  const toggleBtn = document.createElement("button");

  toggleBtn.classList.add("btn");
  toggleBtn.classList.add("authorize");
  toggleBtn.style.marginLeft = "24px";

  toggleBtn.innerText = "Toggle-NightMode";

  toggleBtn.addEventListener("click", () => {
    const newCssLink1 = document.querySelector("#newCssLink1");
    const isNewCssLink1Valid = !!newCssLink1;
    if (isNewCssLink1Valid) {
      document.head.removeChild(newCssLink1);
      return;
    } else {
      const newCssLink = document.createElement("link");
      newCssLink.rel = "stylesheet";
      newCssLink.type = "text/css";
      newCssLink.href = "/swagger-static-files/SwaggerNightCSS.css";
      newCssLink.id = "newCssLink1";

      document.head.appendChild(newCssLink);
    }
  });

  h2Title.appendChild(toggleBtn);
};

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(fn, 500);
});
