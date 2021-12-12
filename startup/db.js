const mongoose = require("mongoose");
const debug = require("debug")("app:db");
const config = require("config");

module.exports = () => {
  debug(`DB URL = ${config.get("db")}`);
  mongoose
    .connect(config.get("db"))
    .then(() => debug("Connected to mongodb..."))
    .catch((err) => debug(err));
};
