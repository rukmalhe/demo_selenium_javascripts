const isAdmin = require("../../utility/isAdmin");
const cleanUp = require("../../utility/cleanUp");
const dbconnection = require("../../utility/getMongoDBConnection");
const { ObjectId } = require("mongodb");

const handler = async event => {
  const body = JSON.parse(event.body);

  //validate data
  let validVacancyData = {
    Name: cleanUp(body.Name),
    Description: cleanUp(body.Description),
    Business: cleanUp(body.Business),
    CreatedDate: cleanUp(body.CreatedDate),
    ExpiryDate: cleanUp(body.ExpiryDate),
    PayRate: cleanUp(body.PayRate)
  }

  //if (body.CreatedDate >999 && body.CreatedDate < 9999)
  if (body.Business != "Finance" && body.Business != "Manufacturing" && body.Business != "Hospitality" && body.Business != "Office") {
    validVacancyData.Business = "Other";
  }

  if (isAdmin(event)) {

    if (!ObjectId.isValid(body.id)) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: false })
      };
    }
    // db connection
    const client = await dbconnection();
    await client.db().collection("clients").findOneAndUpdate({ _id: new ObjectId(body.id) }, { $set: validVacancyData });
    client.close;

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true })
    };
  } else {

    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: false })
    };
  }

}

module.exports = { handler };