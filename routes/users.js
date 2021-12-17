const express = require("express");
const validateId = require("../middleware/validateId");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const admin = require("../middleware/admin");
const coordinator = require("../middleware/coordinator");
const {
  createUser,
  getUsers,
  getCoordinators,
  getAdmins,
  addAdmin,
  searchUser,
  removeAdmin,
} = require("../controllers/users");

const router = express.Router();

router.post("/", asyncMiddleware(createUser));
router.get("/", [coordinator], asyncMiddleware(getUsers));
router.get("/coordinators", [admin], asyncMiddleware(getCoordinators));
router.get("/admins", [admin], asyncMiddleware(getAdmins));
router.post("/admins/:id", [validateId], asyncMiddleware(addAdmin));
router.delete("/admins/remove/:id", [validateId], asyncMiddleware(removeAdmin));
router.get("/search", [coordinator], asyncMiddleware(searchUser));

module.exports = router;
