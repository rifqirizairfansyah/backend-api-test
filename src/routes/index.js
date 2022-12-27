const express = require("express");
const router = express.Router();

const userController = require("../controllers/user_controller");
const { checkRequest, requiredRequest } = require("../utils");

// Users
router.post(
  "/users",
  userController.create
);

router.delete(
  "/users/:id",
  userController.destroy
);

module.exports = router;
