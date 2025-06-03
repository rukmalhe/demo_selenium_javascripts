async function start() {
  const ourPromise = await fetch("/.netlify/functions/adminDashboard");
  const ourData = await ourPromise.json();
  //console.log(ourData);
  if (ourData.success) {
    console.log(ourData);
  } else {
    window.location = "/login";
  }

}
start();