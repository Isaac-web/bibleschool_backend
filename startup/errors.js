const winston = require("winston");
const config = require("config");

module.exports = () =>
  winston.add(new winston.transports.File({ filename: "./logs/error.log" }));
  if (config.get("enableWinstonConsole"))
    winston.add(new winston.transports.Console({}));

  process.on("uncaughtException", (err) => {
    winston.error(err.message, err);
    process.exit(1);
  });

  process.on("unhandledRejection", (err) => {
    winston.error(err.message, err);
    process.exit(1);
  });

  const privateKey = config.get("jwtPrivateKey") || process.env.JWT_PRIVATE_KEY;
  if (!privateKey) {
    console.log(
      `\x1b[31m%s\x1b[0m`,
      "FATAL ERROR: jwtPrivateKey is undefined."
    );
    process.exit(1);
  }
