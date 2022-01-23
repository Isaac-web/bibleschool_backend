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
    groupLink: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      min: 0,
      max: 500,
      default: "",
    },
    enrollments: {
      type: Number,
      min: 0,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: function () {
        return Date.now();
      },
    },
  })
);

function validate(course) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    image: Joi.string(),
    coordinator: Joi.string().required(),
  });

  return schema.validate(course);
}

module.exports.Course = Course;
module.exports.validate = validate;
