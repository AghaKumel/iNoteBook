const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = "KumelAgha110";

const router = express.Router();

// ROUTE 1:  create a user using  :  POST "/api/auth/createuser"  doesn't require authentication

router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isAlpha().isLength({ min: 3 }),
    body("email", "Enter a valid mail").isEmail(),
    body("password", "Enter a valid Password")
      .isAlphanumeric()
      .isLength({ min: 5 }),
  ],
  async (req, res) => {
    const result = validationResult(req);
    let success=false;

    // if there are any errors then return that bad errors
    if (!result.isEmpty()) {
      return res.status(400).json({ success,errors: result.array() });
    }
    try {
      //check if user already exits
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({success, error: "This email already exits" });
      }
      //securing password more intensely using hash funcion and salt
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);

      success=true;
      res.json({success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE 2:  getting login  :  POST "/api/auth/login"  doesn't require authentication

router.post(
  "/login",
  [
    body("email", "Enter a valid mail").isEmail(),
    body("password", "Password cant be empty").exists(),
  ],
  async (req, res) => {

    let success=false;

    const result = validationResult(req);
    // if there are any errors then return that bad errors
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({success, error: "Please try to login with with correct credentials" });
      }
      const passcompare = await bcrypt.compare(password, user.password);
      if (!passcompare) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Please try to login with with correct credentials" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(payload, JWT_SECRET);
      success = true;
      res.send({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE 3:  get loggedin user details  :  POST "/api/auth/getuser" require authentication

router.post("/getuser", fetchuser, async (req, res) => {
  // if there are any errors then return that bad errors
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
}
);

module.exports = router;
