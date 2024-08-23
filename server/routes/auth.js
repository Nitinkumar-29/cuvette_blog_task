const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../modals/User");
const bcrypt = require("bcryptjs");
const jwt_secret = "cuvette_task@2905";
const fetchUser = require("../middleware/fetchUser");
const upload = require("../utils/upload");
const sendEmail = require("../utils/mailer");

// create user
router.post(
  "/createUser",
  upload.single("photo"),
  [
    body("name", "enter your name").isLength({ min: 3, max: 20 }),
    body("email", "enter your email").isEmail().exists(),
    body("password", "enter your pasword atleast 8 character").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;
      let user = await User.findOne({ email });
      if (user) {
        return res.status(403).json("user already exists with this email");
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);

      const profilePhoto = req.file ? req.file.path : undefined;
      user = await User.create({
        profileImage: profilePhoto,
        name: name,
        email: email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
          name: user.name,
        },
      };

      //create a auth token
      const authToken = jwt.sign(data, jwt_secret, { expiresIn: "1h" });

      // verification link
      const verificationLink = `http://localhost:8000/api/auth/verify/${authToken}`;
      // Send the verification email
      const subject = "Email Verification";
      const text = `Please verify your email by clicking on the following link: ${verificationLink}`;
      const html = `<p>Please verify your email by clicking on the following link: <a href="${verificationLink}">${verificationLink}</a></p>`;

      await sendEmail(email, subject, text, html);

      res.json({ authToken, success: true });
      console.log("account created!");
    } catch (error) {
      console.error(error);
      return res.status(500).json("internal server error");
    }
  }
);

// verify email
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, jwt_secret);
    console.log('Decoded token:', decoded);

    // Extract the user ID from the decoded token
    const userId = decoded.user.id;
    console.log('User ID from token:', userId);

    // Find and update the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Example: mark the user as verified
    user.userVerified = true;
    await user.save();

    res.status(200).json({ msg: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(400).json({ msg: 'Invalid or expired token' });
  }
});


// login user
router.post("/login", [
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json("not found");
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(401).json("invalid credentials");
      }
      const data = {
        user: {
          id: user.id,
          name: user.name,
        },
      };

      const authToken = jwt.sign(data, jwt_secret);
      res.status(200).json({ authToken, success: true });
      console.log("user logged in!");
    } catch (error) {
      console.error(error);
      return res.status(500).json("internal server error");
    }
  },
]);

// get user data on login
router.get("/getUser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json("not found");
    }
    res.json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json("internal server error");
  }
});

module.exports = router;
