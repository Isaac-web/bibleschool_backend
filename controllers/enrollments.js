const _ = require("lodash");
const Joi = require("joi");
const { Enrollment, validate } = require("../models/Enrollment");
const { Course } = require("../models/Course");
const { Module } = require("../models/Module");
const { first } = require("lodash");

const createEnrollment = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = await Course.findById(req.body.courseId);
  if (!course) return res.status(404).send("Course not found.");

  const existingEnrollment = await Enrollment.findOne({
    course: req.body.courseId,
    user: req.body.userId,
  });

  if (existingEnrollment)
    return res.status(400).send("You are already enrolled in this course.");

  const firstModule = await Module.findOne({ course: course._id });

  if (!firstModule)
    return res.status(400).send("Cannot enroll in this course.");

  const enrollment = new Enrollment({
    user: req.body.userId,
    course: req.body.courseId,
    currentModule: firstModule._id,
  });

  await enrollment.save();

  res.send(enrollment);
};

const getEnrollments = async (req, res) => {
  const enrollments = await Enrollment.find()
    .populate("course", "title")
    .populate("user");

  res.send(enrollments);
};

const getUserEnrollments = async (req, res, next) => {
  const { userId } = req.params;

  const enrollments = await Enrollment.find({ userId }).populate(
    "course",
    "title imageUri"
  );

  res.send(enrollments);
};

const updateEnrollment = async (req, res) => {
  const { error } = validateOnUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const enrollment = await Enrollment.findByIdAndUpdate(
    req.params.id,
    {
      $set: _.pick(req.body, ["status", "progress"]),
    },
    { new: true }
  );

  if (!enrollment) return res.status(404).send("Enrollment not found.");

  return res.send(enrollment);
};

const deleteEnrollment = async (req, res) => {
  const enrollment = await Enrollment.findByIdAndRemove(req.params.id);

  if (!enrollment) return res.status(404).send("Enrollment not found.");

  res.send(enrollment);
};

const validateOnUpdate = (enrollment) => {
  const schema = Joi.object({
    status: Joi.string().min(3).max(15),
    progress: Joi.number().min(0).max(100),
  });

  return schema.validate(enrollment);
};

exports.createEnrollment = createEnrollment;
exports.getEnrollments = getEnrollments;
exports.getUserEnrollments = getUserEnrollments;
exports.updateEnrollment = updateEnrollment;
exports.deleteEnrollment = deleteEnrollment;