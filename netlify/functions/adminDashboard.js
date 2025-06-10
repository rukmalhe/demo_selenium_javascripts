const { MongoClient } = require("mongodb");
const escape = require("escape-html");
const isAdmin = require("../../utility/isAdmin");
const dbconnection = require("../../utility/getMongoDBConnection");


const handler = async event => {

  if (isAdmin(event)) {

    // db connection
    const client = await dbconnection();
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
              <h3>${escape(agencyClient.Name)}</h3>
              <p class="client-description">${escape(agencyClient.Description)}</p>
                <div class="action-items">
                  <a class="action-btn" href="/admin/editVacancy?id=${agencyClient._id}">Edit Vacancy</a>
                  <button onClick="handleDelete('${agencyClient._id}', this)" class="action-btn">Delete Vacancy</button>
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