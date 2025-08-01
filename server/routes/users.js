const express = require("express");
const router = express.Router();
const { register, login, logout, user } = require("../controllers/users");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", authMiddleware, register);
router.post("/login", authMiddleware, login);
router.post("/logout", authMiddleware, logout);
router.get("/user", authMiddleware, user);

module.exports = router;
