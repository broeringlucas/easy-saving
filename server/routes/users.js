const express = require("express");
const router = express.Router();
const { register, login, logout, user } = require("../controllers/users");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/user", authMiddleware, user);

module.exports = router;
