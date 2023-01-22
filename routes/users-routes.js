const express = require("express");
const router = express.Router();
const userController = require("../controller/users-controller");
const { check } = require("express-validator");

router.post(
  "/register",
  [check("username").not().isEmpty(), check("password").isLength({ min: 5 })],
  userController.registerUser
);
router.post("/login", userController.loginUser);

module.exports = router;
