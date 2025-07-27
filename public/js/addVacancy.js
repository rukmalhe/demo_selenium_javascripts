document.querySelector("#manage-vacancy-form").addEventListener("submit",
  async function Submit(evnt) {

    //blocking client side java script when submission
    evnt.preventDefault();

    //multiple click event block
    if (isFormSubmit == false) {
      return null;
    }
    isFormSubmit = false;

    //Form Values
    const vacancyDetails = {
      Name: document.querySelector("#CompanyName").value,
      Description: document.querySelector("#VacancyDescription").value,
      CreatedDate: document.querySelector("#published-date-vacancy").value,
      Business: document.querySelector("#Business").value,
      PayRate: document.querySelector("#PayRate").value,
      ExpiryDate: document.querySelector("#expiry-date-vacancy").value

    };

    if (coudinaryReturnResponse) {
      vacancyDetails.public_id = coudinaryReturnResponse.public_id;
      vacancyDetails.version = coudinaryReturnResponse.version;
      vacancyDetails.signature = coudinaryReturnResponse.signature;

    }
    //console.log("this is vacancy Details: ", vacancyDetails);

    const ourPromise = await fetch("/.netlify/functions/addVacancy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vacancyDetails)
    })

    //adding form animation effect on saving
    document.querySelector("#manage-vacancy-form").classList.add("form-animation");
    const ourData = await ourPromise.json(); // this is respoonse body

    //console.log(ourData);
    //this is response 

    if (ourPromise.status == 201) {
      window.location = "/admin/";
    } else {
      console.log("Error While Saving", ourData);
    }

  })