const Joi = require("joi");
const { Module } = require("../models/Module");
const { Enrollment } = require("../models/Enrollment");

const markQuiz = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);


  const quizQuestions = req.body.questions;

  const module = await Module.findById(req.body.moduleId);
  const questions = module.questions;
  const correctAnswers = [];
  const wrongAnswers = [];

  for (let i = 0; i < questions.length; i++) {
    if (questions[i].ans.trim() == quizQuestions[i].ans.trim())
      correctAnswers.push(questions[i]);
    else wrongAnswers.push(questions[i]);
  }

  const score = correctAnswers.length / questions.length;

  let nextModule;
  let enrollment = await Enrollment.findById(req.body.enrollmentId).populate(
    "course"
  );

  const totalModules = await Module.find({
    course: enrollment.course._id,
  }).count();

  if (score >= 0.7) {
    const modules = await Module.find({
      course: enrollment.course._id,
    });

    const index = modules.findIndex((m) => m._id == req.body.moduleId);
    nextModule = modules[index + 1] ? modules[index + 1] : modules[index];

    enrollment.currentModule = nextModule._id;
    enrollment.coveredModules.push(req.body.moduleId);

    const progress = enrollment.coveredModules.length / totalModules;
    enrollment.progress = progress.toFixed(2) * 100;

    if (enrollment.coveredModules.length === totalModules)
      enrollment.status = "complete";
    enrollment.save();
  }

  const result = {
    correctAnswers,
    wrongAnswers,
    score,
  };

  if (enrollment) result.enrollment = enrollment;
  res.send(result);
};

const validate = (quiz) => {
  const schema = Joi.object({
    moduleId: Joi.objectId().required(),
    enrollmentId: Joi.objectId().required(),
    questions: Joi.array().required(),
  });

  return schema.validate(quiz);
};

exports.markQuiz = markQuiz;
