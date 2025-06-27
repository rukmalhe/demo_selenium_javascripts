const logger = require("../../utility/logger");
const cloudinary = require("../../utility/setCloudinaryConfig");
const isAdmin = require("../../utility/isAdmin");
const cleanUp = require("../../utility/cleanUp");
const dbconnection = require("../../utility/getMongoDBConnection");


const handler = async event => {
  try {
    const body = JSON.parse(event.body);
    logger.info("Application: 📥 Received appliation submission");

    //validate data
    let validApplicationData = {
      VisaSponsership: cleanUp(body.VisaStatus),
      NotificationPeriod: cleanUp(body.NoticePeriod),
      StartDate: cleanUp(body.StartDate),
      InternalApplicant: cleanUp(body.InternalCandidate),
      Salutation: cleanUp(body.Salutation),
      FirstName: cleanUp(body.FirstName),
      LastName: cleanUp(body.LastName),
      Email: cleanUp(body.Email),
      Phone: cleanUp(body.Phone),
      FutureContact: cleanUp(body.FutureContact)
    }

    /* //if (body.CreatedDate >999 && body.CreatedDate < 9999)
     const valifBusinessCategory = ["Finance", "Manufacturing", "Hospitality", "Office"];
     if (!valifBusinessCategory.includes(validApplicationData.Business)) {
       logger.warn(`Vacancy: ⚠️ Invalid business category: ${validApplicationData.Business}, defaulting to "Other"`);
       validApplicationData.Business = "Other";
     }
 */
    //GETTING signagure value from the Server by providing public id, version and api secrets
    const expectedCVSignature = cloudinary.utils.api_sign_request(
      {
        public_id: body.cv_public_id,
        version: String(body.cv_version)
      },
      process.env.CLOUDINARYSECRETS);
    logger.debug(`Application: Signature received | signature: ${body.cv_signature}, Expected CV Signature: ${expectedCVSignature}`);

    //validate the signature
    if (expectedCVSignature === body.cv_signature) {
      validApplicationData.CV = body.cv_public_id;
      logger.info("Application: ✅ Cloudinary signature verified");
    } else {
      validApplicationData.CV = null;
      logger.warn("Application: ❌ Cloudinary signature mismatch");
    }

    //GETTING signagure value from the Server by providing public id, version and api secrets
    const expectedCLSignature = cloudinary.utils.api_sign_request(
      {
        public_id: body.cl_public_id,
        version: String(body.cl_version)
      },
      process.env.CLOUDINARYSECRETS);
    logger.debug(`Application: Signature received | signature: ${body.cl_signature}, Expected CV Signature: ${expectedCLSignature}`);

    //validate the signature
    if (expectedCLSignature === body.cl_signature) {
      validApplicationData.CL = body.cl_public_id;
      logger.info("Application: ✅ Cloudinary signature verified");
    } else {
      validApplicationData.CL = null;
      logger.warn("Application: ❌ Cloudinary signature mismatch");
    }

    // db connection
    const client = await dbconnection();
    await client.db().collection("job_applications").insertOne(validApplicationData);
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