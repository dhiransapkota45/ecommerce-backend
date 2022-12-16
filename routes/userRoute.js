const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const fetchuser = require("../middlewares/token");

const userControllerInstance = new userController();
router.post("/signup", userControllerInstance.signup);
router.post("/login", userControllerInstance.login);
router.get(
  "/usercartproduct",
  fetchuser,
  userControllerInstance.usercartproduct
);
router.post("/verifyrefresh", userControllerInstance.verifyRefreshToken);

module.exports = router;
