const express = require("express");
require("dotenv").config();
require("express-async-errors");

require("./startup/errors")();

const app = express();
require("./startup/middleware")(app);
require("./startup/prod")(app);
require("./startup/routes")(app);
require("./startup/db")();
const server = require("./startup/port")(app);

module.exports = server;
