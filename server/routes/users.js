const express = require("express");
const router = express.Router();
const { register, login, logout, user } = require("../controllers/users");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

router.post("/register", AuthMiddleware, register);
router.post("/login", AuthMiddleware, login);
router.post("/logout", AuthMiddleware, logout);
router.get("/user", AuthMiddleware, user);

module.exports = router;
