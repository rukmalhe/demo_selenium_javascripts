const urlVariables = new URLSearchParams(window.location.search);
const vacancyId = urlVariables.get("id");

async function editVacancyDetails() {
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
    document.querySelector("#publishedDate").value = result.vacancyDetail.CreatedDate;
    document.querySelector("#Business").value = result.vacancyDetail.Business;
    document.querySelector("#PayRate").value = result.vacancyDetail.PayRate;
    document.querySelector("#ClosingDate").value = result.vacancyDetail.ExpiryDate;

    document.querySelector("#update-vacancy-form").classList.remove("form-animation");
    document.querySelector("CompanyName").forcus();

  } else {
    window.location = "/admin/";
    console.log("Error While Saving", vacancyDetail);
  }
}

editVacancyDetails()

//This is the update Selection
document.querySelector("#update-vacancy-form").addEventListener("submit",
  async function Submit(evnt) {

    //blocking client side java script when submission
    evnt.preventDefault();

    //adding animation effect on form
    document.querySelector("#update-vacancy-form").classList.add("form-animation");
    //Form Values sending with ID, intercepting
    const vacancyDetails = {
      id: vacancyId,
      Name: document.querySelector("#CompanyName").value,
      Description: document.querySelector("#VacancyDescription").value,
      CreatedDate: document.querySelector("#publishedDate").value,
      Business: document.querySelector("#Business").value,
      PayRate: document.querySelector("#PayRate").value,
      ExpiryDate: document.querySelector("#ClosingDate").value

    };
    //console.log("this is cleaned Data: ", vacancyDetails);

    const ourPromise = await fetch("/.netlify/functions/saveVacancy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vacancyDetails)
    })

    const ourData = await ourPromise.json(); // this is respoonse body

    //console.log("updated Data", ourData);
    //this is response 
    if (ourPromise.status == 201) {
      window.location = "/admin/";
    } else {
      console.log("Error While Saving", ourData);
    }
  })