const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const { isAuthenticated } = require("../middleware/auth");

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

// Get current user
router.get("/me", isAuthenticated, authController.getCurrentUser);

module.exports = router;
