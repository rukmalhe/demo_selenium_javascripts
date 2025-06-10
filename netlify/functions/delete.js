const { ObjectId } = require("mongodb");
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

    await client.db().collection("clients").deleteOne({ _id: new ObjectId(body.id) });
    client.close;

    //successful query
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true })
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