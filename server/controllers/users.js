const db = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwtHelper = require("../utils/jwtHelper.js");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// register new user
const signupUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const userEmail = await db.findOne({
      where: { email: email },
    });

    if (userEmail) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    return res.status(201).send({ message: "User signed up successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Sign in user
const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.findOne({
      where: { email: email },
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Verify password
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwtHelper.generateToken({ id: user.user_id });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).send({ message: "Login successful" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const user = async (req, res) => {
  const user = await db.findByPk(req.userId);
  if (!user) return res.status(404).send({ message: "User not found" });

  res.status(200).send({
    user_id: user.user_id,
    username: user.username,
    email: user.email,
  });
};

const allUsers = async (req, res) => {
  try {
    const users = await db.findAll();
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token");
  return res.status(200).send({ message: "Logout successful" });
};

module.exports = { signupUser, signinUser, allUsers, user, logoutUser };
