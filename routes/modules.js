const express = require("express");
const multer = require("multer");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const coordinator = require("../middleware/coordinator");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/files/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 30 },
});


const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const imageUpload = multer({ storage: imageStorage, limits: 1024 * 1024 * 10 });

const {
  createModule,
  getModules,
  getModule,
  updateModule,
  deleteModule,
  deleteModuleQuestion,
  downloadModule,
  uploadFile,
  uploadBackgroundImage,
} = require("../controllers/modules");
const validateId = require("../middleware/validateId");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", [coordinator], asyncMiddleware(createModule));
router.get("/download/", asyncMiddleware(downloadModule));
router.get("/all/:courseId", [auth], asyncMiddleware(getModules));
router.get("/:id", [auth], asyncMiddleware(getModule));
router.patch(
  "/upload/:id",
  [validateId, coordinator, upload.single("fileUpload")],
  asyncMiddleware(uploadFile)
);
router.patch(
  "/background/:id",
  [validateId, coordinator, imageUpload.single("imageUpload")],
  asyncMiddleware(uploadBackgroundImage)
);
router.patch("/:id", [validateId, coordinator], asyncMiddleware(updateModule));
router.delete("/:id", [validateId, coordinator], asyncMiddleware(deleteModule));
router.delete(
  "/:moduleId/:questionId",
  [coordinator],
  asyncMiddleware(deleteModuleQuestion)
);

module.exports = router;
