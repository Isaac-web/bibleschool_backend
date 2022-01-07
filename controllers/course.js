const _ = require("lodash");
const { Course, validate } = require("../models/Course");
const { Enrollment } = require("../models/Enrollment");
const { Module } = require("../models/Module");
const { User } = require("../models/User");

const createCourse = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.coordinator);
  if (!user) return res.status(404).send("User not found.");

  const course = new Course(_.pick(req.body, ["title", "coordinator"]));
  if (req.file) course.imageUri = req.file.path;

  await course.save();

  await User.findByIdAndUpdate(req.body.coordinator, {
    $set: {
      status: "coordinator",
      courseId: course._id,
    },
  });

  const savedCourse = await Course.findById(course._id).populate(
    "coordinator",
    "firstname lastname status"
  );

  res.send(savedCourse);
};

const getCourses = async (req, res) => {
  const courses = await Course.find().populate(
    "coordinator",
    "firstname lastname status email"
  );

  res.send(courses);
};

const getCourse = async (req, res) => {
  const course = await Course.findById(req.params.id).populate(
    "coordinator",
    "firstname lastname status email address"
  );

  if (!course) return res.status(404).send("Course not found.");

  res.send(course);
};

const updateCourse = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = await Course.updateOne(
    req.params.id,
    {
      $set: _.pick(req.body, ["title", "imageUri", "coordinator"]),
    },
    { new: true }
  ).populate("coordinator", "firstname lastname status");

  if (!course) return res.status(404).send("Course not found.");

  res.send(course);
};

const deleteCourse = async (req, res) => {
  const courseId = req.params.id;

  const course = await Course.findByIdAndRemove(req.params.id);

  await Enrollment.deleteMany({ course: courseId });
  await Module.deleteMany({ course: courseId });
  await User.findByIdAndUpdate(course.coordinator, {
    $set: {
      status: "normal",
    },
    $unset: {
      courseId: "",
    },
  });

  if (!course) res.status(404).send("Course not found.");

  res.send(course);
};

module.exports.createCourse = createCourse;
module.exports.getCourses = getCourses;
module.exports.getCourse = getCourse;
module.exports.updateCourse = updateCourse;
module.exports.deleteCourse = deleteCourse;
