const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const HttpError = require("../model/http-error");
const { validationResult } = require("express-validator");
const User = require("../model/user-model");

const SALT_ROUNDS = 10;

const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Input validation failed", 422));
  }

  const { password } = req.body;
  const hash_pass = bcrypt.hashSync(password, SALT_ROUNDS);
  try {
    const newUser = await User.create({ ...req.body, password: hash_pass });
    //   create JWT
    const token = jwt.sign(
      {
        userId: newUser._id,
        username: newUser.password,
        fullName: newUser.fullName,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1hr",
      }
    );

    // send back to front end
    res.json({
      token: token,
      userId: newUser._id,
      username: newUser.username,
      fullName: newUser.fullName,
    });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Error saving data", 422));
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const checkUser = await User.findOne({ username });
    if (checkUser) {
      // Compare hash pass
      if (bcrypt.compareSync(password, checkUser.password)) {
        // Create JWT TOKEN
        const token = jwt.sign(
          {
            userId: checkUser._id,
            username: checkUser.password,
            fullName: checkUser.fullName,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1hr",
          }
        );
        res.json({
          token: token,
          userId: checkUser._id,
          username: checkUser.username,
          fullName: checkUser.fullName,
        });
      } else {
        res.json({ error: "Invalid Password" });
      }
    } else {
      res.json({ error: "Could not find user" });
    }
  } catch (err) {
    return next(new HttpError("Error logging in", 422));
  }
};

exports.registerUser = registerUser;
exports.loginUser = loginUser;
