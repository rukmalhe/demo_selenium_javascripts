document.querySelector("#manage-vacancy-form").addEventListener("submit",
  async function Submit(evnt) {

    //blocking client side java script when submission
    evnt.preventDefault();

    //Form Values
    const vacancyDetails = {
      Name: document.querySelector("#CompanyName").value,
      Description: document.querySelector("#VacancyDescription").value,
      CreatedDate: document.querySelector("#publishedDate").value,
      Business: document.querySelector("#Business").value,
      PayRate: document.querySelector("#PayRate").value,
      ExpiryDate: document.querySelector("#closingDate").value

    };
    console.log(vacancyDetails);

    const ourPromise = await fetch("/.netlify/functions/vacancy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vacancyDetails)
    })

    const ourData = await ourPromise.json(); // this is respoonse body

    console.log(ourData);
    //this is response 
    if (ourPromise.status == 201) {
      window.location = "/admin/addVacancy";
    } else {
      console.log("Error While Saving", ourData);
    }
  })