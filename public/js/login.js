document.querySelector("#login-form").addEventListener("submit", handleSubmite)

document.querySelector('#userName').value = '';
document.querySelector('#password').value = '';
document.querySelector('#login-error-message').style.display = 'none'; // optionally hide error


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
    //show error message
    const errorMessage = document.querySelector("#login-error-message");
    errorMessage.style.display = "block";

  }
}