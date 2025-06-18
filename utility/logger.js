const { createLogger, transports, format } = require("winston");

const loggerTransports = [
  new transports.Console({
    format: format.simple()
  })
];

// Only enable file logging in non-serverless environments
const isNetlify = process.env.NETLIFY === "true";

if (!isNetlify) {
  const fs = require("fs");
  const path = "logs";

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }

  loggerTransports.push(
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" })
  );
}

const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
  ),
  transports: loggerTransports
});

module.exports = logger;
