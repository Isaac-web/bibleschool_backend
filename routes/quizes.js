const express = require("express");
const { markQuiz } = require("../controllers/quizes");
const asyncMiddleware = require("../middleware/asyncMiddleware");

const router = express.Router();

router.post("/", asyncMiddleware(markQuiz));

module.exports = router;
