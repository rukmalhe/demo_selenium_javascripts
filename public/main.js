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

// before calling the openOVerlay method, you have to set the form display property to null.
document.querySelector(".form-overlay-outer-1").style.display = "";

function openOverlay(el) {
  //looking up the DOM tree : closest funtion
  const h3 = el.closest("h3").textContent;
  //loking up the DOM tree and then querySelector of the div element
  const description = el.closest(".client-text").querySelector(".client-description").textContent;
  document.querySelector(".form-overlay-inner h1").textContent = h3;
  document.querySelector(".form-overlay-inner h3").textContent = description;
  document.querySelector(".form-overlay-outer-1").classList.add("form-overlay--is-visibility");
}

document.querySelector(".form-overlay-close-btn").addEventListener("click", closeOverlay);

function closeOverlay() {
  document.querySelector(".form-overlay-outer-1").classList.remove("form-overlay--is-visibility");
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
  if (coverLetterResponse) {
    applicantDetails.cl_public_id = coverLetterResponse.public_id;
    applicantDetails.cl_version = coverLetterResponse.version;
    applicantDetails.cl_signature = coverLetterResponse.signature;

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

  //adding form animation effect on saving
  document.querySelector("#manage-vacancy-form").classList.add("form-animation");

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