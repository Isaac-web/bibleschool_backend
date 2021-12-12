const Joi = require("joi");
Joi.objectId = require("joi-objectid");

const courses = require("../routes/courses");
const modules = require("../routes/modules");
const users = require("../routes/users");
const auth = require("../routes/auth");
const enrollments = require("../routes/enrollments");
const quizes = require("../routes/quizes");
const admin = require("../routes/admin");
const error = require("../middleware/error");

module.exports = (app) => {
  app.get("/", (req, res) => res.send("Hello World"));
  app.use("/api/courses", courses);
  app.use("/api/modules", modules);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/enrollments", enrollments);
  app.use("/api/quizes", quizes);
  app.use("/api/admin", admin);
  app.use(error);
};
