const { MongoClient } = require("mongodb");
const dbconnection = require("../../utility/getMongoDBConnection");


const handler = async () => {
  //const client = new MongoClient(process.env.CONNECTIONSTRING); // Created an environment variable in Netlify 
  // Project
  const client = dbconnection();
  const agencyClient = await client.db().collection("clients").find().toArray();
  client.close;

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json", "access-Control-Allow-Origin": "*" },
    body: JSON.stringify(agencyClient)
  };
};

module.exports = { handler };

/*

//http://localhost:8888/.netlify/functions/agency

async function vacancies(params) {
  const vacancies = await fetch("")
  const vacancyData = await vacancies.json()
  vacancyData.forEach(agencyClient => { //anonymous function, can be called by parameter itself, without mentioning the function name or parenthisis
    console.log(agencyClient.name)
  })
}

*/