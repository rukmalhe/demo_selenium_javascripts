const logger = require("../../utility/logger");
const isAdmin = require("../../utility/isAdmin");
const dbconnection = require("../../utility/getMongoDBConnection");
const cloudinary = require("../../utility/setCloudinaryConfig");

const handler = async event => {

  try {
    logger.info("📥 Received getSignature");
    if (!isAdmin(event)) {
      logger.warn("🔐 Unauthorized attempt to upload vacancy images");
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, message: "Unauthorized" })
      };
    }
    const timestamp = Math.round(new Date().getTime() / 1000); // rounding to nearest whole number
    const signature = cloudinary.utils.api_sign_request({ timestamp }, process.env.CLOUDINARYSECRETS);
    logger.info("📥 getSignature received successfully");

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timestamp, signature })
    };

  } catch (err) {
    logger.error("❌ Error in vacancy handler: " + err.message);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, error: "Internal Server Error" })
    };
  }

};

//http://localhost:8888/.netlify/functions/getSignature

module.exports = { handler }