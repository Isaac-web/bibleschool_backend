const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    minlength: 3,
    maxlength: 100,
    trim: true,
    required: true,
  },
  lastname: {
    type: String,
    minlength: 3,
    maxlength: 100,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    minlength: 7,
    maxlength: 100,
    trim: true,
    required: true,
  },
  mobile: {
    type: String,
    minlength: 3,
    maxlength: 15,
    trim: true,
  },
  address: {
    type: String,
    minlength: 7,
    maxlength: 150,
    trim: true,
  },
  status: {
    type: String,
    enum: ["normal", "coordinator", "admin"],
    default: "normal",
  },
  password: {
    type: String,
    minlength: 7,
    maxlength: 1024,
    required: true,
  },
  courseId: {
    type: String,
    required: [
      function () {
        return this.status === "coordinator";
      },
      "CourseId is required for a coordinator.",
    ],
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      status: this.status,
      courseId: this.courseId,
      email: this.email,
      name: `${this.firstname} ${this.lastname}`,
    },
    config.get("jwtPrivateKey")
  );
};

const User = mongoose.model("User", userSchema);

const validate = (user) => {
  const schema = Joi.object({
    firstname: Joi.string().min(3).max(100).required(),
    lastname: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().min(3).max(15),
    address: Joi.string().min(3).max(150),
    password: Joi.string().min(7).max(150),
  });

  return schema.validate(user);
};

exports.User = User;
exports.validate = validate;