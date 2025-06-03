const template = document.querySelector("#client-template");
const wrapper = document.createDocumentFragment(); // create a block of json objects in to one set of block

async function vacancies(params) {
  const vacancies = await fetch("http://localhost:8888/.netlify/functions/agency");
  const vacancyData = await vacancies.json()
  vacancyData.forEach(clients => { //anonymous function, can be called by parameter itself, without mentioning the function name or parenthisis
    const clone = template.content.cloneNode(true); //
    clone.querySelector(".client-detail").dataset.Business = clients.Business;

    //adding all the clones to one block
    clone.querySelector("h3").textContent = clients.Name;
    clone.querySelector(".client-description").textContent = clients.Description;

    clone.querySelector(".hire-rate").textContent = clients.PayRate;
    if (!clients.CompanyLogo) {
      clients.CompanyLogo = "images/Fallback.png";
    }
    clone.querySelector(".client-image img").src = clients.CompanyLogo;
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
    if (currentFilter == el.dataset.Business || All) {
      //set grid attribute to display
      el.style.display = "grid";
    } else {
      el.style.display = "none";
    }
  })

}