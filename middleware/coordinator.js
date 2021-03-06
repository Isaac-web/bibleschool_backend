const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  if (config.get("disableAuth")) return next();

  
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  
  if (decoded.status !== "coordinator" && decoded.status !== "admin") {
    return res.status(403).send("Access Denied.");
  }

  next();
};
