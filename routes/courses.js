const express = require("express");
const validateId = require("../middleware/validateId");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const multer = require("multer");

const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/course");
const admin = require("../middleware/admin");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage, limits: 1024 * 1024 * 10 });

router.get("/", asyncMiddleware(getCourses));
router.get("/:id", [validateId], asyncMiddleware(getCourse));
router.post(
  "/",
  [admin, upload.single("image")],
  asyncMiddleware(createCourse)
);
router.patch("/:id", [validateId, admin], asyncMiddleware(updateCourse));
router.delete("/:id", [validateId, admin], asyncMiddleware(deleteCourse));

module.exports = router;
