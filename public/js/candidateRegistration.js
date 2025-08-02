//overlay form
const overlayForRegistration = document.querySelector(".overlay--registration");



//open form
function openOverlayForRegistration(el) {
  console.log("Clicked Register button");

  // before calling the openOVerlay method, you have to set the form display property to null.
  document.querySelector(".overlay--registration").style.display = "";
  if (overlayForRegistration) { overlayForRegistration.classList.add("form-overlay--is-visibility-2"); }
  else {
    console.error("Overlay element not found");
  }
}

document.getElementById('candidate-registration').addEventListener('click', openOverlayForRegistration);

function closeOverlayofRegistration() {
  overlayForRegistration.classList.remove("form-overlay--is-visibility-2");
}
document.getElementById('form-overlay-close-btn-2').addEventListener("click", closeOverlayofRegistration);


document.getElementById("general-register-form").addEventListener("submit", async function registration(el) {
  el.preventDefault();

  const registrationForm = document.getElementById("general-register-form");

  const applicantDetails = {

    FirstName: registrationForm.querySelector("input[id='reg_first_name']").value,
    LastName: registrationForm.querySelector("input[name='last_name']").value,
    Email: registrationForm.querySelector("input[name='email']").value,
    Phone: registrationForm.querySelector("input[name='phone']").value,
    Preference: registrationForm.querySelector("input[name='preferred_role']").value,
    FutureContact: registrationForm.querySelector("input[name='reg_consent_privacy']:checked").value

  }

  if (typeof cvUploadResponse !== "undefined" && cvUploadResponse) {
    applicantDetails.cv_public_id = cvUploadResponse.public_id;
    applicantDetails.cv_version = cvUploadResponse.version;
    applicantDetails.cv_signature = cvUploadResponse.signature;

  }
  console.log(applicantDetails);

  document.getElementById("general-register-form").classList.add("form-animation");

  const ourPromise = await fetch("/.netlify/functions/candidateRegistration", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(applicantDetails)
  })

  if (ourPromise.status == 201) {
    const thankYouEl = document.getElementById("general-thank-you");
    if (thankYouEl) {
      thankYouEl.classList.add("thank-you--visible-2");
      document.querySelector(".overlay--registration").style.display = "none";
      setTimeout(closeOverlay, 1500);
      setTimeout(() => {
        document.getElementById("general-thank-you").classList.remove("thank-you--visible");
      }, 1900);
    }

  } else {
    console.log("Error While Saving", ourPromise);
  }
}

)