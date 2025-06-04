const { MongoClient } = require("mongodb");

async function getMongoDBConnection() {
  const client = new MongoClient(process.env.CONNECTIONSTRING); // Created an environment variable in 
  await client.connect();
  return client;

}

module.exports = getMongoDBConnection;
