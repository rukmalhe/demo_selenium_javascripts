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

//this function is being called in the AdminDashboard JS
function handleDelete(id, el) {
  el.closest(".client-detail").remove();
  fetch("/.netlify/functions/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  })
}