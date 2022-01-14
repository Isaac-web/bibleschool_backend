const winston = require("winston");
const debug = require("debug")("app:errors");

module.exports = (err, req, res, next) => {
  winston.error(err.message, err);
  debug(err.message, err);
  res.status(500).send("Opps! Something went wrong.");
};
