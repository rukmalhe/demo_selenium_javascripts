const isAdmin = require("../../utility/isAdmin");
const handler = async event => {
  const body = JSON.parse(event.body);

  if (isAdmin(event)) {
    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true })
    };
  } else {

    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: false })
    };
  }

}

module.exports = { handler };