const logger = require("../../utility/logger");
const cloudinary = require("../../utility/setCloudinaryConfig");
const isAdmin = require("../../utility/isAdmin");
const cleanUp = require("../../utility/cleanUp");
const dbconnection = require("../../utility/getMongoDBConnection");
const { ObjectId } = require("mongodb");

const handler = async event => {

  try {
    logger.info("Edit Vacancy: 📥 Received vacancy updation....");
    const body = JSON.parse(event.body);
    if (!isAdmin(event)) {
      logger.warn("Vacancy: 🔐 Unauthorized attempt to post vacancy");
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, message: "Unauthorized" })
      }
    }

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

    if (!ObjectId.isValid(body.id)) {
      logger.warn("Eidt Vacancy: Error when attemptting to post vacancy, object id mismatched");
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: false })
      };
    }

    // When the photo is changed and new attributes should be validated
    if (body.signature) {
      logger.debug(`Edit Vacancy: New Photo details ${body.public_id}, ${body.version}`);
      //GETTING signagure value from the Server by providing public id, version and api secrets
      const expectedSignature = cloudinary.utils.api_sign_request(
        {
          public_id: body.public_id,
          version: String(body.version)
        },
        process.env.CLOUDINARYSECRETS);

      logger.debug(`Edit Vacancy: Signature received | Actual signature: ${body.signature}, Expected Signature: ${expectedSignature}`);

      //validate the signature
      if (expectedSignature === body.signature) {
        validVacancyData.photo = body.public_id;
        logger.info("Edit Vacancy: ✅ Cloudinary signature verified");
      } else {
        validVacancyData.photo = null;
        logger.warn("Edit Vacancy: ❌ Cloudinary signature mismatched, photo is set to null");
      }
    }

    // db connection
    const client = await dbconnection();
    await client.db().collection("clients").findOneAndUpdate({ _id: new ObjectId(body.id) }, { $set: validVacancyData });
    await client.close;
    logger.info("Edit Vacancy: 📦 Vacancy data Updated successfully");

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true })
    };


  } catch (err) {
    logger.error("Edit Vacancy: ❌ Error in vacancy handler: " + err.message);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, error: "Internal Server Error" })
    };
  }

}

module.exports = { handler };