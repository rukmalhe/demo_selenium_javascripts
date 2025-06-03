document.querySelector("#login-form").addEventListener("submit", handleSubmite)

//blocking client side java script when submission
async function handleSubmite(evnt) {
  evnt.preventDefault();

  //check login attempts
  const ourPromise = await fetch("/.netlify/functions/loginAttempts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: document.querySelector("#userName").value, password: document.querySelector("#password").value })
  })

  const ourData = await ourPromise.json(); // this is respoonse body

  console.log(ourData);
  //this is response 
  if (ourPromise.status == 200) {
    window.location = "/admin";
  } else {
    console.log("Try Again");
  }
}