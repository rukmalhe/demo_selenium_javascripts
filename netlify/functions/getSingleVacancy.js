const { ObjectId } = require("mongodb");
const escape = require("escape-html");
const isAdmin = require("../../utility/isAdmin");
const dbconnection = require("../../utility/getMongoDBConnection");


const handler = async event => {

  // cheking permissions
  if (isAdmin(event)) {

    const body = JSON.parse(event.body);
    //if the id is invalid, send an error
    if (!ObjectId.isValid(body.id)) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "invalid vanancy" })
      };
    }
    // db connection
    const client = await dbconnection();
    //console.log(body);

    const vacancyDetail = await client.db().collection("clients").findOne({ _id: new ObjectId(body.id) });
    client.close;

    // escaping db values for sanitization
    vacancyDetail.Name = escape(vacancyDetail.Name);
    vacancyDetail.Description = escape(vacancyDetail.Description);
    vacancyDetail.Businsess = escape(vacancyDetail.Businsess);
    vacancyDetail.CreatedDate = escape(vacancyDetail.CreatedDate);
    vacancyDetail.PayRate = escape(vacancyDetail.PayRate);
    vacancyDetail.ExpiryDate = escape(vacancyDetail.ExpiryDate);

    //successful query
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, vacancyDetail })
    };
  }
  //un authorized request
  return {
    statusCode: 401,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ success: false })
  };
};

module.exports = { handler }