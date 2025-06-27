const logger = require("../../utility/logger");
const isAdmin = require("../../utility/isAdmin");
const dbconnection = require("../../utility/getMongoDBConnection");
const cloudinary = require("../../utility/setCloudinaryConfig");

const handler = async event => {

  try {
    const context = event.queryStringParameters?.context || "admin";
    const timestamp = Math.round(new Date().getTime() / 1000); // rounding to nearest whole number
    const ip =
      event.headers["x-forwarded-for"]?.split(",")[0] || // handles proxies
      event.headers["client-ip"] ||
      event.headers["x-real-ip"] ||
      "unknown";

    logger.info(`📥 Received getSignature (context: ${context})`);
    logger.info(`📍 Applicant IP: ${ip}`);

    if (context == 'admin') {
      if (!isAdmin(event)) {
        logger.warn("🔐 Unauthorized attempt to upload vacancy images");
        return {
          statusCode: 401,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ success: false, message: "Unauthorized" })
        };
      }

      const signature = cloudinary.utils.api_sign_request({ timestamp }, process.env.CLOUDINARYSECRETS);
      logger.info("📥 Admin: getSignature received successfully");
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timestamp, signature })
      };

    } if (context == "cv") {
      const signature = cloudinary.utils.api_sign_request({ timestamp, folder: "cv_uploads" }, process.env.CLOUDINARYSECRETS);

      logger.info("✅ Applicant CV signature generated");

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timestamp, signature }),
      }
    }
    // Invalid context fallback
    logger.warn(`⚠️ Unrecognized context: ${context}`);
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, message: "Invalid context" }),
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