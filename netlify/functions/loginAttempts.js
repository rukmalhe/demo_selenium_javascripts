const cookie = require("cookie");

const handler = async event => {

  const body = JSON.parse(event.body);

  if (body.username == "rukmal" && body.password == "password"
  ) {
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