const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  if (config.get("disableAuth")) return next();

  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  const isExpired = isTokenExpired(token);
  if (isExpired) return res.status(401).send("Session expired. Please Login.");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};

const isTokenExpired = (token) => {
  const payload = JSON.parse(atob(token.split(".")[1]));
  const expiry = payload?.exp;

  if (!expiry) return true;

  return Math.floor(Date.now() / 1000) >= expiry;
};
