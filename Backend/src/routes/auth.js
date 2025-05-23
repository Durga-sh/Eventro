const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const { isAuthenticated, generateToken } = require("../middleware/auth");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User"); // Make sure to import your User model
const config = require("../config/config"); // Import your config file


// Initialize the Google OAuth client
const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);

// Register route
router.post("/register", authController.register);

// Login route
router.post("/login", authController.login);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleCallback
);

// Google One-Tap/Sign-in with Google Button verification
router.post("/google/verify", async (req, res) => {
  try {
    console.log("Google verification request received");
    const { credential } = req.body;

    if (!credential) {
      console.log("No credential provided");
      return res.status(400).json({ message: "No credential provided" });
    }

    console.log("Verifying Google token");
    // Verify the Google credential token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: config.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("Google payload received:", {
      email: payload.email,
      name: payload.name,
    });

    // Check if user exists in the database
    let user = await User.findOne({ email: payload.email });

    if (!user) {
      // Create new user from Google data
      console.log("Creating new user from Google data");
      user = new User({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        avatar: payload.picture,
        isEmailVerified: true, // Google has already verified the email
      });

      await user.save();
    } else if (!user.googleId) {
      // Link Google account to existing user
      console.log("Linking Google account to existing user");
      user.googleId = payload.sub;
      user.avatar = user.avatar || payload.picture;
      if (!user.isEmailVerified) user.isEmailVerified = true;

      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Google verification error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get current user
router.get("/me", isAuthenticated, authController.getCurrentUser);

module.exports = router;
