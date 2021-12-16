const express = require("express");
const validateId = require("../middleware/validateId");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const {
  createEnrollment,
  getEnrollments,
  getUserEnrollments,
  deleteEnrollment,
  getCoordinatorEnrollments,
} = require("../controllers/enrollments");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", [auth], asyncMiddleware(createEnrollment));
router.get(
  "/coordinators/:courseId",
  asyncMiddleware(getCoordinatorEnrollments)
);
router.get("/:userId", [auth], asyncMiddleware(getUserEnrollments));
router.get("/", [auth], asyncMiddleware(getEnrollments));
router.delete("/:id", [validateId, auth], asyncMiddleware(deleteEnrollment));

module.exports = router;
