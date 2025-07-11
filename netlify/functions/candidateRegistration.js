const logger = require("../../utility/logger");
const cloudinary = require("../../utility/setCloudinaryConfig");
const cleanUp = require("../../utility/cleanUp");
const dbconnection = require("../../utility/getMongoDBConnection");


const handler = async event => {
  try {
    const body = JSON.parse(event.body);
    logger.info("Register Candidate: 📥 Received appliation submission");

    //validate data
    let validApplicationData = {

      FirstName: cleanUp(body.FirstName),
      LastName: cleanUp(body.LastName),
      Email: cleanUp(body.Email),
      Phone: cleanUp(body.Phone),
      FutureContact: cleanUp(body.FutureContact)
    }

    const expectedCVSignature = cloudinary.utils.api_sign_request(
      {
        public_id: body.cv_public_id,
        version: String(body.cv_version)
      },
      process.env.CLOUDINARYSECRETS);
    logger.debug(`Register Candidate: Signature received | signature: ${body.cv_signature}, Expected CV Signature: ${expectedCVSignature}`);

    //validate the signature
    if (expectedCVSignature === body.cv_signature) {
      validApplicationData.CV = body.cv_public_id;
      logger.info("Register Candidate: ✅ Cloudinary signature verified");
    } else {
      validApplicationData.CV = null;
      logger.warn("Register Candidate: ❌ Cloudinary signature mismatch");
    }

    // db connection
    const client = await dbconnection();
    await client.db().collection("candidates").insertOne(validApplicationData);
    await client.close;

    logger.info("Register Candidate: 📦 Vacancy data saved to DB successfully");

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    logger.error("Register Candidate: ❌ Error in vacancy handler: " + err.message);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, error: "Internal Server Error" })
    };
  }
}

module.exports = { handler };