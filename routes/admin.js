const express = require("express");
const { Course } = require("../models/Course");
const { Enrollment } = require("../models/Enrollment");
const { User } = require("../models/User");

const router = express.Router();

router.get("/summery", async (req, res) => {
  const enrollmentsCount = await Enrollment.find().count();
  const coursesCount = await Course.find().count();
  const adminsCount = await User.find({ status: "admin" }).count();
  const coordinatorsCount = await User.find({ status: "coordinator" }).count();

  const responsePayload = {
    enrollmentsCount,
    coursesCount,
    adminsCount,
    coordinatorsCount,
  };
  res.send(responsePayload);
});

module.exports = router;
