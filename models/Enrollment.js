const mongoose = require("mongoose");
const Joi = require("joi");

const Enrollment = mongoose.model(
  "Enrollment",
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    currentModule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
    },
    coveredModules: [String],
    status: {
      type: String,
      enum: ["inprogress", "complete"],
      required: true,
      default: "inprogress",
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      get: function (v) {
        return Math.round(v);
      },
    },
  })
);

function validate(enrollment) {
  const schema = Joi.object({
    userId: Joi.objectId().required(),
    courseId: Joi.objectId().required(),
    currentModuleId: Joi.objectId(),
    status: Joi.string(),
    progress: Joi.number(),
  });

  return schema.validate(enrollment);
}

exports.validate = validate;
exports.Enrollment = Enrollment;
