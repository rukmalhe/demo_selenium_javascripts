const cookie = require("cookie");

function isAdmin(event) {
  const incomingCookie = cookie.parse(event.headers.cookie || "");
  if (incomingCookie?.jobagency == "1234567890") {
    return true
  } else { return false }
}
module.exports = isAdmin;