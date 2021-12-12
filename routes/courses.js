const express = require("express");
const validateId = require("../middleware/validateId");
const asyncMiddleware = require("../middleware/asyncMiddleware");

const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/course");
const admin = require("../middleware/admin");

const router = express.Router();

router.get("/", asyncMiddleware(getCourses));
router.get("/:id", [validateId], asyncMiddleware(getCourse));
router.post("/", [admin], asyncMiddleware(createCourse));
router.patch("/:id", [validateId, admin], asyncMiddleware(updateCourse));
router.delete("/:id", [validateId, admin], asyncMiddleware(deleteCourse));

module.exports = router;
