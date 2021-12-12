const winston = require("winston");
const config = require("config");

module.exports = () =>
  winston.add(new winston.transports.File({ filename: "./logs/error.log" }));

process.on("uncaughtException", (err) => {
  winston.error(err.message, err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  winston.error(err.message, err);
  process.exit(1);
});

if (!config.get("jwtPrivateKey")) {
  console.log(`\x1b[32m%s\x1b[0m]`, "FATAL ERROR: jwtPrivateKey is undefined.");
  process.exit(1);
}
