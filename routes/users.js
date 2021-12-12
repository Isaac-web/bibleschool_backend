const express = require("express");
const validateId = require("../middleware/validateId");
const asyncMiddleware = require("../middleware/asyncMiddleware");
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
router.get("/", asyncMiddleware(getUsers));
router.get("/coordinators", asyncMiddleware(getCoordinators));
router.get("/admins", asyncMiddleware(getAdmins));
router.post("/admins/:id", [validateId], asyncMiddleware(addAdmin));
router.delete("/admins/remove/:id", [validateId], asyncMiddleware(removeAdmin));
router.get("/search", asyncMiddleware(searchUser));
router.get("/search", (req, res) => {});

module.exports = router;
