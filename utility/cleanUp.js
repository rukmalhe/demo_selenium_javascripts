const sanitizeHTML = require("sanitize-html");
function cleanUp(x) {
  return sanitizeHTML(x, {
    allowedTags: [],
    allowedAttributes: {}
  })
}
module.exports = cleanUp;