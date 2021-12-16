const mongoose = require("mongoose");
const debug = require("debug")("app:db");
const config = require("config");

module.exports = () => {
  const dbUrl = config.get("db") || process.env.MONGO_DB_URL;

  debug(`DB URL = ${dbUrl}`);
  mongoose
    .connect(config.get("db"))
    .then(() => debug("Connected to mongodb..."))
    .catch((err) => debug(err));
};
