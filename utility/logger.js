const { createLogger, transports, format } = require("winston");

// Detect if running in serverless (e.g., Netlify)
const isServerless = !!process.env.NETLIFY || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

const loggerTransports = [
  new transports.Console({
    format: format.simple()
  })
];

if (!isServerless) {
  // Only require fs and add file logging in local/server environments
  const fs = require("fs");
  const path = "logs";

  try {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    loggerTransports.push(
      new transports.File({ filename: "logs/error.log", level: "error" }),
      new transports.File({ filename: "logs/combined.log" })
    );
  } catch (err) {
    console.warn("❗Logger: Failed to create log directory. Falling back to console only.", err.message);
  }
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
