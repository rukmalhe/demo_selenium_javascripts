const { MongoClient } = require("mongodb");

const cookie = require("cookie");

const handler = async event => {

  const incomingCookie = cookie.parse(event.headers.cookie || "");
  if (incomingCookie?.jobagency == "1234567890") {

    // db connection
    const client = new MongoClient(process.env.CONNECTIONSTRING); // Created an environment variable in 
    await client.connect();
    const agencyClient = await client.db().collection("clients").find().toArray();
    client.close;

    // json and html
    const vacanciesHTML = generateHTML(agencyClient);


    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, clients: vacanciesHTML })
    };
  }
  return {
    statusCode: 401,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ success: false })
  };
};

function generateHTML(agencyClient) {
  // let is to append the value
  let ourHTML = `<div class="list-of-clients">`;
  ourHTML += agencyClient.map(agencyClient => {
    return `<div class="client-detail">
            <div class="client-text">
              <h3>${agencyClient.Name}</h3>
              <p class="client-description">${agencyClient.Description}</p>
                <div class="action-items">
                  <a class="action-btn" href=#>Edit Vacancy</a>
                  <button class="action-btn">Delete Vacancy</button>
                </div>
              </div>
            <div class="client-image">
            <img src="/images/hello-Fresh-logo.jpg" alt="warehoiuse staff"> </div>
          </div>`;
  }).join(""); // array of agencies scoched into one element
  ourHTML += "</div>";
  return ourHTML;
}
module.exports = { handler }