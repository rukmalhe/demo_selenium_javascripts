const urlVariables = new URLSearchParams(window.location.search);
const vacancyId = urlVariables.get("id");

async function editVacancyDetails() {
  try {
    const ourPromise = await fetch("/.netlify/functions/getSingleVacancy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: vacancyId })
    })

    const result = await ourPromise.json(); // this is respoonse body

    //this is response 
    if (ourPromise.status == 200) {
      document.querySelector("#CompanyName").value = result.vacancyDetail.Name;
      document.querySelector("#VacancyDescription").value = result.vacancyDetail.Description;
      document.querySelector("#published-date-vacancy").value = result.vacancyDetail.CreatedDate;
      document.querySelector("#Business").value = result.vacancyDetail.Business;
      document.querySelector("#PayRate").value = result.vacancyDetail.PayRate;
      document.querySelector("#expiry-date-vacancy").value = result.vacancyDetail.ExpiryDate;
      document.querySelector("#update-vacancy-form").classList.remove("form-animation");

      if (result.vacancyDetail.photo) {
        //assign photo src into the html file
        document.querySelector("#photo-preview").innerHTML = `<img src="https://res.cloudinary.com/dnf2dypvu/image/upload/w_190,h_190,c_fill/${result.vacancyDetail.photo}.jpg">`;
      }
      document.querySelector("#CompanyName").focus();

    } else {
      window.location = "/admin/";
      console.log("error status: ");
    }
  }
  catch (err) {
    console.log("error in response", err);
  }
}

editVacancyDetails();

//This is the update Selection
document.querySelector("#update-vacancy-form").addEventListener("submit",
  async function Submit(evnt) {

    //blocking client side java script when submission
    evnt.preventDefault();

    console.log("form is locked:", isFormSubmit);
    //multiple click event block
    isFormSubmit = false;

    //adding animation effect on form
    document.querySelector("#update-vacancy-form").classList.add("form-animation");
    //Form Values sending with ID, intercepting
    const vacancyDetails = {
      id: vacancyId,
      Name: document.querySelector("#CompanyName").value,
      Description: document.querySelector("#VacancyDescription").value,
      CreatedDate: document.querySelector("#published-date-vacancy").value,
      Business: document.querySelector("#Business").value,
      PayRate: document.querySelector("#PayRate").value,
      ExpiryDate: document.querySelector("#expiry-date-vacancy").value,

    };
    // when photo is changed, we add new attributes to the vacancy Details page
    if (coudinaryReturnResponse) {
      vacancyDetails.public_id = coudinaryReturnResponse.public_id;
      vacancyDetails.version = coudinaryReturnResponse.version;
      vacancyDetails.signature = coudinaryReturnResponse.signature;

    }
    console.log("Vacancy Details: ", vacancyDetails);

    const ourPromise = await fetch("/.netlify/functions/editVacancy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vacancyDetails)
    })

    const ourData = await ourPromise.json(); // this is respoonse body

    console.log("Updated Data", ourData);
    //this is response 
    if (ourPromise.status == 201) {
      window.location = "/admin/";
    } else {
      console.log("Error While Saving", ourData);
    }
  })