const mongoose = require("mongoose");
const Joi = require("joi");

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    title: {
      type: String,
      min: 2,
      max: 100,
      required: true,
      trim: true,
    },
    imageUri: {
      type: String,
      default: "",
    },
    coordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    enrollments: {
      type: Number,
      min: 0,
      default: 0,
    },
  })
);

function validate(course) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    imageUri: Joi.string(),
    coordinator: Joi.string().required(),
  });

  return schema.validate(course);
}

module.exports.Course = Course;
module.exports.validate = validate;
