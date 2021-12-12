const bcrypt = require("bcrypt");
const Joi = require("joi");
const { User } = require("../models/User");

const login = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid username or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Invalid username or password.");

  const token = user.generateAuthToken();

  res.send({ token });
};

const validate = (auth) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(7).max(150),
  });

  return schema.validate(auth);
};

exports.login = login;
