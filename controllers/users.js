const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/User");

const createUser = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) return res.status(400).send("Username is already taken.");

  const { password, confirmPassword } = req.body;
  const passwordsMatch = password === confirmPassword;
  if (!passwordsMatch) return res.status(400).send("Passwords do not match.");

  const users = await User.find();

  const user = new User(
    _.pick(req.body, ["firstname", "lastname", "email", "address", "mobile"])
  );

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  user.password = hashedPassword;

  if (!users.length) user.status = "admin";

  await user.save();

  const token = user.generateAuthToken();

  res
    .header("access-control-expose-headers", "x-auth-token")
    .header("x-auth-token", token)
    .send(
      _.pick(user, ["firstname", "lastname", "email", "address", "mobile"])
    );
};

const getUsers = async (req, res) => {
  const users = await User.find().limit(10);

  res.send(users);
};

const getCoordinators = async (req, res) => {
  const users = await User.find({ status: "coordinator" });
  res.send(users);
};

const getAdmins = async (req, res) => {
  const users = await User.find({ status: /.*admin.*/i });
  res.send(users);
};

const addAdmin = async (req, res) => {
  const userId = req.params.id;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        status: "admin",
      },
    },
    { new: true }
  );

  if (!user) return res.status(404).send("User not found.");

  res.send(user);
};

const removeAdmin = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    $set: {
      status: "normal",
    },
  });

  if (!user) return res.status(404).send("User not found.");

  res.send(user);
};

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) return res.status(404).send("User not found.");

  res.send(user);
};

const searchUser = async (req, res) => {
  const { username } = req.query;

  const search = new RegExp(username, "i");
  const users = await User.find({ email: search }).select("-password");

  res.send(users);
};

exports.createUser = createUser;
exports.getUsers = getUsers;
exports.getCoordinators = getCoordinators;
exports.getAdmins = getAdmins;
exports.addAdmin = addAdmin;
exports.searchUser = searchUser;
exports.removeAdmin = removeAdmin;
exports.getCurrentUser = getCurrentUser;

