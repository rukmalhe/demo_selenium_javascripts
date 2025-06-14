const { MongoClient } = require("mongodb");
const escape = require("escape-html");
const isAdmin = require("../../utility/isAdmin");
const dbconnection = require("../../utility/getMongoDBConnection");
const logger = require("../../utility/logger");


const handler = async event => {
  logger.info("Admin Dashboard: SERVER");

  if (!isAdmin(event)) {
    logger.warn("Admin Dashboard: 🔐 Unauthorized attempt to Add vacancy");
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: false })
    };
  }
  try {

    // db connection
    const client = await dbconnection();
    const agencyClient = await client.db().collection("clients").find().toArray();
    await client.close();

    logger.info("Admin Dashboard:: 📦 Vacancy data retrieved from the DB successfully");
    // json and html
    const vacanciesHTML = generateHTML(agencyClient);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, clients: vacanciesHTML })
    };
  }
  catch (err) {
    logger.error("Admin Dashboard: ❌ Error in Admin Dashboard: " + err.message);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, error: "Internal Server Error" })
    };

  }
}

function generateHTML(agencyClient) {

  // let is to append the value
  let ourHTML = `<div class="list-of-clients">`;

  ourHTML += agencyClient.map(agencyClient => {
    const photo_id = agencyClient.photo;

    if (!agencyClient.photo) {
      agencyClient.photo = "/images/Fallback.jpg";
    } else {
      agencyClient.photo = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/w_330,h_392,c_fill/${photo_id}.jpg`;

    }

    logger.debug(`Admin Dashboard: Photo URL ${agencyClient.photo}`);

    return `<div class="client-detail">
            <div class="client-text">
              <h3>${escape(agencyClient.Name || "Unnamed Client")}</h3>
              <p class="client-description">${escape(agencyClient.Description || "")}</p>
                <div class="action-items">
                  <a class="action-btn" href="/admin/editVacancy?id=${agencyClient._id || ''}">Edit Vacancy</a>
                  <button onClick="handleDelete('${agencyClient._id}', this)" class="action-btn">Delete Vacancy</button>
                </div>
              </div>
            <div class="client-image">
            <img src="${agencyClient.photo}" alt="warehoiuse staff"> </div>
          </div>`;
  }).join(""); // array of agencies scoched into one element
  ourHTML += "</div>";
  return ourHTML;
}
module.exports = { handler }