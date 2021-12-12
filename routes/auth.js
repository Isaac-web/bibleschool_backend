const express = require("express");
const { login } = require("../controllers/auth");
const asyncMiddleware = require("../middleware/asyncMiddleware");

const router = express.Router();

router.post("/", asyncMiddleware(login));

module.exports = router;
