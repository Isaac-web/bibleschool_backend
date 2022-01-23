const { Module, validate } = require("../models/Module");
const { Course } = require("../models/Course");
const _ = require("lodash");
const path = require("path");
const multer = require("multer");

const coordinator = require("../middleware/coordinator");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}_${file.originalname}`);
  },
});

const createModule = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = await Course.findById(req.body.courseId);
  if (!course) return res.status(400).send("Invalid course.");

  const module = new Module(_.pick(req.body, ["title", "subtitle", "fileUri"]));

  module.course = req.body.courseId;
  module.imageUri = course.imageUri;

  await module.save();

  res.send(module);
};

const getModules = async (req, res) => {
  const modules = await Module.find({ course: req.params.courseId });
  const course = await Course.findById(req.params.courseId).select(
    "title imageUri groupLink"
  );
  res.send({ course, modules });
};

const getModule = async (req, res) => {
  const { id } = req.params;

  const module = await Module.findById(id).populate("course");
  if (!module) return res.status(404).send("Module not found.");

  res.send(module);
};

const updateModule = async (req, res) => {
  const { id } = req.params;

  const module = await Module.findByIdAndUpdate(
    id,
    { $set: _.pick(req.body, ["title", "content", "questions"]) },
    { new: true }
  ).populate("course");

  if (!module) return res.status(404).send("Module not found");

  res.send(module);
};

const uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).send("Please provide a valid file.");

  const module = await Module.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        fileUri: req.file.path,
      },
    },
    { new: true }
  );

  res.send(module);
};

const uploadBackgroundImage = async (req, res) => {
  if (!req.file) return res.status(400).send("Please provide a valid file.");

  const module = await Module.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        imageUri: req.file.path,
      },
    },
    { new: true }
  );

  res.send(module);
};

const downloadModule = async (req, res) => {
  const { path: filePath } = req.query;
  res.download(path.join(__dirname + "/..", filePath));
};

const deleteModule = async (req, res) => {
  const { id } = req.params;

  const module = await Module.findByIdAndRemove(id);

  if (!module) res.send("Module not found.");

  res.send(module);
};

const deleteModuleQuestion = async (req, res) => {
  const { moduleId, questionId } = req.params;

  const module = await Module.findById(moduleId);
  if (!module) res.status(404).send("Module not found.");

  const questions = module.questions;
  const question = questions.id(questionId);
  question.remove();

  await module.save();

  res.send(module);
};

module.exports.createModule = createModule;
module.exports.getModules = getModules;
module.exports.getModule = getModule;
module.exports.updateModule = updateModule;
module.exports.uploadFile = uploadFile;
module.exports.uploadBackgroundImage = uploadBackgroundImage;
module.exports.downloadModule = downloadModule;
module.exports.deleteModule = deleteModule;
module.exports.deleteModuleQuestion = deleteModuleQuestion;
