const express = require("express");
const router = express.Router();
const { signupUser, signinUser, allUsers } = require("../controllers/users");

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.get("/", allUsers);

module.exports = router;
