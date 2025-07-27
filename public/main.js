/*
#################################
The main JavaScript file for the Job Agency Service
created by Rukmal
Which is handling display of vacancies, filtering, and application submission.
##################################
*/

/*
#################################
This file is part of the Job Agency Service project.
It is responsible for fetching and displaying job vacancies,
It uses the Fetch API to retrieve data from a serverless function.
###################################
*/
const template = document.querySelector("#client-template");
const wrapper = document.createDocumentFragment(); // create a block of json objects in to one set of block

async function vacancies(params) {
  const vacancies = await fetch("/.netlify/functions/vacancy");
  const vacancyData = await vacancies.json();

  vacancyData.forEach(clients => { //anonymous function, can be called by parameter itself, without mentioning the function name or parenthisis
    const clone = template.content.cloneNode(true); //

    // Create the button - apply
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "apply-vacancy-btn");
    button.setAttribute("onclick", "openOverlay(this)");
    button.setAttribute("aria-label", "Apply");
    ////

    //Create the SVG
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "50");
    svg.setAttribute("height", "50");
    svg.setAttribute("viewBox", "0 0 30 30");
    svg.setAttribute("fill", "rgb(18, 18, 193)");
    svg.setAttribute("class", "bi bi-envelope-check-fill");

    // Add a path to the SVG
    const path1 = document.createElementNS(svgNS, "path");
    path1.setAttribute("d", "M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.026A2 2 0 0 0 2 14h6.256A4.5 4.5 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586zM16 4.697v4.974A4.5 4.5 0 0 0 12.5 8a4.5 4.5 0 0 0-1.965.45l-.338-.207z");

    const path2 = document.createElementNS(svgNS, "path");
    path2.setAttribute("d", "M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-1.993-1.679a.5.5 0 0 0-.686.172l-1.17 1.95-.547-.547a.5.5 0 0 0-.708.708l.774.773a.75.75 0 0 0 1.174-.144l1.335-2.226a.5.5 0 0 0-.172-.686");

    svg.appendChild(path1);
    svg.appendChild(path2)

    const h3 = clone.querySelector("h3");

    //adding all the clones to one block
    h3.textContent = clients.Name + " ";


    // Append SVG to button, then button to h3
    button.appendChild(svg);
    h3.appendChild(button);

    clone.querySelector(".client-detail").dataset.Business = clients.Business;
    clone.querySelector(".client-description").textContent = clients.Description;

    clone.querySelector(".hire-rate").textContent = clients.PayRate;

    const photo_id = clients.photo;

    if (!clients.photo) {
      clients.photo = "/images/Fallback.jpg";
    } else {
      clients.photo = `https://res.cloudinary.com/dnf2dypvu/image/upload/w_330,h_392,c_fill/${photo_id}.jpg`;
    }

    clone.querySelector(".client-image img").src = clients.photo;
    clone.querySelector(".client-image img").alt = `The company logo ${clients.Name}`;
    wrapper.appendChild(clone);
  })
  document.querySelector(".list-of-clients").appendChild(wrapper);
}

vacancies();

/*
#################################
this file is part of the Job Agency Service project.
It is responsible for filtering the job vacancies based on the button clicked.
It uses the DOM manipulation to add and remove classes for active buttons.
##################################
*/
//button filter code
const AllButtons = document.querySelectorAll(".client-filter button");
//add Event Listner catches the events
AllButtons.forEach(el => { el.addEventListener("click", handleButtonClick) });

function handleButtonClick(evnt) {
  //click event passes status, and it will be passed here
  // remove active classes
  AllButtons.forEach(el => { el.classList.remove("active") });
  // add active class to other buttons which is clicked on
  AllButtons.forEach(el => {
    evnt.target.classList.add("active");

  });
  // filter details
  // there is a "data" attribute set in the html file to catch that button element, i.e. data-filter="finance"
  const currentFilter = evnt.target.dataset.filter;
  console.log(currentFilter);
  document.querySelectorAll(".client-detail").forEach(el => {
    if (currentFilter == el.dataset.Business || currentFilter == "All") {
      //set grid attribute to display
      el.style.display = "grid";
    } else {
      el.style.display = "none";
    }
  })

}

/*
#################################
This file is part of the Job Agency Service project.
It is responsible for handling the overlay functionality for job applications.
It allows users to open and close the application overlay, and submit their applications.
##################################
*/
// before calling the openOverlay method, you have to set the form display property to null.
document.querySelector(".overlay--vacancy").style.display = "";

function openOverlay(el) {
  console.log("open overlay called");
  //looking up the DOM tree : closest funtion
  const h3 = el.closest("h3").textContent;
  //loking up the DOM tree and then querySelector of the div element
  const description = el.closest(".client-text").querySelector(".client-description").textContent;
  document.querySelector(".overlay__inner h1").textContent = h3;
  document.querySelector(".overlay__inner h3").textContent = description;
  document.querySelector(".overlay--vacancy").classList.add("form__overlay--is-visibility");
}

document.querySelector(".overlay--vacancy__close-btn").addEventListener("click", closeOverlay);

function closeOverlay() {
  document.querySelector(".overlay--vacancy").classList.remove("form__overlay--is-visibility");

  // Reset form fields
  form.reset();

  // Reset file inputs (manual, since form.reset() might not clear them visually)
  document.getElementById("cv-upload-id").value = "";
  document.getElementById("additional-files-vacancy-id").value = "";

  // Clear upload responses
  cvUploadResponse = null;
  coverLetterResponse = null;

  // Clear any warnings
  document.getElementById("cv-upload-id-warning").textContent = "";
  document.getElementById("additional-files-vacancy-id-warning").textContent = "";

  // Reset any form animation
  document.querySelector("#overlay-vacancy-outer").classList.remove("form-animation");
}

// submit application form when the form event is triggered 
const form = document.getElementById("form-vacancy");
const visaSponsorEleClassName = 'visa-sponsorship-vacancy'
const noticePeriodEleClassName = 'notice-period-vacancy';
const startDateEleClassName = 'start-date-vacancy';
const internalCandidateEleClassName = 'internal-candidate-vacancy';
const saluationEleClassName = 'salutation-vacancy';
const firstNameEleClassName = 'first-name-vacancy';
const lastNameEleClassName = 'last-name-vacancy';
const emailEleClassName = 'email-vacancy';
const phoneEleClassName = 'phone-vacancy';
const futureContactEleClassName = 'consent-privacy-vacancy';

form.addEventListener("submit", async function applicationSubmission(el) {
  el.preventDefault();

  console.log("Form submission start!");


  const applicantDetails = {
    VisaStatus: form.querySelector(`input[name="${visaSponsorEleClassName}"]:checked`).value,
    NoticePeriod: form.querySelector(`input[name="${noticePeriodEleClassName}"]:checked`).value,
    StartDate: form.querySelector(`input[name="${startDateEleClassName}"]`).value,
    InternalCandidate: form.querySelector(`input[name="${internalCandidateEleClassName}"]:checked`).value,
    Salutation: form.querySelector(`select[name="${saluationEleClassName}"]`).value,
    FirstName: form.querySelector(`input[name="${firstNameEleClassName}"]`).value,
    LastName: form.querySelector(`input[name="${lastNameEleClassName}"]`).value,
    Email: form.querySelector(`input[name="${emailEleClassName}"]`).value,
    Phone: form.querySelector(`input[name="${phoneEleClassName}"]`).value,
    FutureContact: form.querySelector(`input[name="${futureContactEleClassName}"]:checked`).value

  }

  if (cvUploadResponse) {
    applicantDetails.cv_public_id = cvUploadResponse.public_id;
    applicantDetails.cv_version = cvUploadResponse.version;
    applicantDetails.cv_signature = cvUploadResponse.signature;

  }
  if (coverLetterResponse) {
    applicantDetails.cl_public_id = coverLetterResponse.public_id;
    applicantDetails.cl_version = coverLetterResponse.version;
    applicantDetails.cl_signature = coverLetterResponse.signature;

  }
  console.log(applicantDetails);

  const ourPromise = await fetch("/.netlify/functions/addApplications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(applicantDetails)
  })

  if (ourPromise.status == 201) {
    const thankYouEl = document.querySelector("#thank-you-vacancy-id");
    if (thankYouEl) {
      thankYouEl.classList.add("thank-you--visible");

      setTimeout(() => {
        document.querySelector("#thank-you-vacancy-id").classList.remove("thank-you--visible");
      }, 1500);
    }

  } else {
    console.log("Error While Saving", ourPromise);
  }
  setTimeout(closeOverlay, 1900);
})