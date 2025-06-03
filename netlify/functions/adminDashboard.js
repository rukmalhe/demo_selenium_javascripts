const cookie = require("cookie");

const handler = async event => {

  const incomingCookie = cookie.parse(event.headers.cookie || "");
  if (incomingCookie?.jobagency == "1234567890") {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true })
    };
  }
  return {
    statusCode: 401,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ success: false })
  };
};

module.exports = { handler };