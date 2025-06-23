const express = require("express");
const router = express.Router();
const {
  signupUser,
  signinUser,
  logoutUser,
  user,
} = require("../controllers/users");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.post("/logout", logoutUser);
router.get("/user", authMiddleware, user);

module.exports = router;
