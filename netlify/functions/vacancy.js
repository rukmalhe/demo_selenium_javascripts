const { MongoClient } = require("mongodb");
const dbconnection = require("../../utility/getMongoDBConnection");


const handler = async () => {
  //const client = new MongoClient(process.env.CONNECTIONSTRING); // Created an environment variable in Netlify 
  // Project
  const client = await dbconnection();
  const agencyClient = await client.db().collection("clients").find().toArray();
  client.close;

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json", "access-Control-Allow-Origin": "*" },
    body: JSON.stringify(agencyClient)
  };
};

module.exports = { handler };