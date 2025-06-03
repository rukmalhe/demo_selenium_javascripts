const cookie = require("cookie");

const handler = async event => {
  const newCookie = cookie.serialize("jobagency", "-", {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    maxAge: 0
  })
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json", "Set-Cookie": newCookie, "Location": "/" },
    body: JSON.stringify({ success: true })
  };
};

module.exports = { handler };