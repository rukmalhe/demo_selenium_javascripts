document.querySelector("#logout").addEventListener("click", async function () {
  const ourPromise = await fetch("/.netlify/functions/logoutFunction");
  window.location = "/";
})
