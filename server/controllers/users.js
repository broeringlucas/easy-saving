const db = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwtHelper = require("../utils/jwtHelper.js");
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
      return res.status(400).send({ message: "Email already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

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
      return res.status(401).send({ message: "Invalid password" });
    }

    // Generate token
    const token = jwtHelper.generateToken({ id: user.user_id });

    return res.status(200).send({
      accessToken: token,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const allUsers = async (req, res) => {
  try {
    const users = await db.findAll();
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = { signupUser, signinUser, allUsers };
