const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require("../controllers/auth");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authentication");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.route("/logout").get(logoutUser);

module.exports = router;
