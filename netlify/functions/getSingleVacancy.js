const logger = require("../../utility/logger");
const { ObjectId } = require("mongodb");
const escape = require("escape-html");
const isAdmin = require("../../utility/isAdmin");
const dbconnection = require("../../utility/getMongoDBConnection");


const handler = async event => {
  logger.info("handler: getSingleVacancy..");
  try {// cheking permissions
    if (!isAdmin(event)) {

      logger.warn(`Unauthorized accessed to Admin module`);
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: false })
      };
    }

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
    const vacancyDetail = await client.db().collection("clients").findOne({ _id: new ObjectId(body.id) });
    await client.close;
    logger.debug(`Single Vacacy: ${vacancyDetail.Name}`);
    if (vacancyDetail.photo) {
      logger.debug(`Single Vacacy: ${vacancyDetail.photo}`);
    }


    // escaping db values for sanitization
    vacancyDetail.Name = escape(vacancyDetail.Name);
    vacancyDetail.Description = escape(vacancyDetail.Description);
    vacancyDetail.Businsess = escape(vacancyDetail.Businsess);
    vacancyDetail.CreatedDate = escape(vacancyDetail.CreatedDate);
    vacancyDetail.PayRate = escape(vacancyDetail.PayRate);
    vacancyDetail.ExpiryDate = escape(vacancyDetail.ExpiryDate);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, vacancyDetail })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err })
    };
  }
}



module.exports = { handler }