const isAdmin = require("../../utility/isAdmin");
const dbconnection = require("../../utility/getMongoDBConnection");

const handler = async event => {
  const body = JSON.parse(event.body);

  if (isAdmin(event)) {

    // db connection
    const client = await dbconnection();
    const agencyClient = await client.db().collection("clients").find().toArray();
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