const logger = require("../../utility/logger");
const cloudinary = require("../../utility/setCloudinaryConfig");
const isAdmin = require("../../utility/isAdmin");
const cleanUp = require("../../utility/cleanUp");
const dbconnection = require("../../utility/getMongoDBConnection");


const handler = async event => {
  try {
    const body = JSON.parse(event.body);
    logger.info("Add Vacancy: 📥 Received vacancy submission");

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
    const valifBusinessCategory = ["Finance", "Manufacturing", "Hospitality", "Office"];
    if (!valifBusinessCategory.includes(validVacancyData.Business)) {
      logger.warn(`Vacancy: ⚠️ Invalid business category: ${validVacancyData.Business}, defaulting to "Other"`);
      validVacancyData.Business = "Other";
    }

    //GETTING signagure value from the Server by providing public id, version and api secrets
    const expectedSignature = cloudinary.utils.api_sign_request(
      {
        public_id: body.public_id,
        version: String(body.version)
      },
      process.env.CLOUDINARYSECRETS);
    logger.debug(`Vacancy: Signature received | signature: ${body.signature}, Expected Signature: ${expectedSignature}`);

    //validate the signature
    if (expectedSignature === body.signature) {
      validVacancyData.photo = body.public_id;
      logger.info("Vacancy: ✅ Cloudinary signature verified");
    } else {
      validVacancyData.photo = null;
      logger.warn("Vacancy: ❌ Cloudinary signature mismatch");
    }
    if (!isAdmin(event)) {
      logger.warn("Vacancy: 🔐 Unauthorized attempt to post vacancy");
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, message: "Unauthorized" })
      };
    }

    // db connection
    const client = await dbconnection();
    await client.db().collection("clients").insertOne(validVacancyData);
    await client.close;

    logger.info("Vacancy: 📦 Vacancy data saved to DB successfully");

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    logger.error("Vacancy: ❌ Error in vacancy handler: " + err.message);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, error: "Internal Server Error" })
    };
  }
}

module.exports = { handler };