async function start() {
  const ourPromise = await fetch("/.netlify/functions/adminDashboard");
  const ourData = await ourPromise.json();
  //console.log(ourData);
  if (ourData.success) {
    document.querySelector("#admin-render-clients").innerHTML = ourData.clients;

  } else {
    window.location = "/login";
  }

}
start();
