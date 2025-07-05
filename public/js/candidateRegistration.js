document.querySelector("#candidate-registration").addEventListener("click", openOverlay);

document.querySelector("#general-register-form").addEventListener("submit",
  async function Submit(evnt) {
  }

)
function openOverlay(el) {
  document.querySelector(".form-overlay-outer").classList.add("form-overlay--is-visibility");
}

document.querySelector(".form-overlay-close-btn").addEventListener("click", closeOverlay);

function closeOverlay() {
  document.querySelector(".form-overlay-outer").classList.remove("form-overlay--is-visibility");
}

document.querySelector(".form-overlay-inner").addEventListener("submit", async function applicationSubmission(el) {
  el.preventDefault();
  const form = document.querySelector(".form-overlay");

  const applicantDetails = {
    VisaStatus: form.querySelector("input[name='visa_sponsorship']:checked").value,
    NoticePeriod: form.querySelector("input[name='notice_period']:checked").value,
    StartDate: form.querySelector("input[name='start_date']").value,
    InternalCandidate: form.querySelector("input[name='internal_candidate']:checked").value,
    Salutation: form.querySelector("select[name='salutation']").value,
    FirstName: form.querySelector("input[name='first_name']").value,
    LastName: form.querySelector("input[name='last_name']").value,
    Email: form.querySelector("input[name='email']").value,
    Phone: form.querySelector("input[name='phone']").value,
    FutureContact: form.querySelector("input[name='consent_future_contact']:checked").value
  }
  if (cvUploadResponse) {
    applicantDetails.cv_public_id = cvUploadResponse.public_id;
    applicantDetails.cv_version = cvUploadResponse.version;
    applicantDetails.cv_signature = cvUploadResponse.signature;

  }

  console.log(applicantDetails);

  document.querySelector("#form-overlay-id").classList.add("form-animation");

  const ourPromise = await fetch("/.netlify/functions/addApplications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(applicantDetails)
  })

  if (ourPromise.status == 201) {
    const thankYouEl = document.querySelector(".thank-you");
    if (thankYouEl) {
      thankYouEl.classList.add("thank-you--visible");
      //document.querySelector(".form-overlay-outer").style.display = "none";
      setTimeout(closeOverlay, 1500);
      setTimeout(() => {
        document.querySelector(".thank-you").classList.remove("thank-you--visible");
      }, 1900);
    }

  } else {
    console.log("Error While Saving", ourPromise);
  }
})