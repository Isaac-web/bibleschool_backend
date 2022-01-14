const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const questionsSchema = new mongoose.Schema({
  question: {
    type: String,
    minlength: 3,
    maxlength: 500,
    required: true,
    trim: true,
  },
  ans: {
    type: String,
    minlength: 1,
    maxlength: 100,
    required: true,
    trim: true,
  },
  objectives: [String],
});

const Module = mongoose.model(
  "Module",
  new mongoose.Schema({
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    title: {
      type: String,
      min: 3,
      max: 100,
      trim: true,
      required: true,
    },
    content: {
      type: String, 
      minlength: 0, 
      default: "",
    },
    fileUri: {
      type: String,
      trim: true,
    },
    imageUri: {
      type: String,
      trim: true,
    },
    questions: [questionsSchema],
  })
);

function validate(module) {
  const schema = Joi.object({
    courseId: Joi.objectId().required(),
    title: Joi.string().min(3).max(100).required(),
    fileUri: Joi.string(),
    imageUri: Joi.string(),
    questions: Joi.array(),
  });

  return schema.validate(module);
}

exports.Module = Module;
exports.validate = validate;
