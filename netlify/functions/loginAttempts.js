const cookie = require("cookie");

const handler = async event => {

  const body = JSON.parse(event.body);

  if (body.username == "rukmal" && body.password == "password"
  ) {
    const newCookie = cookie.serialize("jobagency", "1234567890", {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24
    })
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Set-Cookie": newCookie, "Location": "/" },
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