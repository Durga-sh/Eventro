
const User = require("../models/User");
const { generateToken } = require("../middleware/auth");

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password , role  } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // If user signed up with Google and doesn't have a password
    if (!user.password) {
      return res.status(400).json({ message: "Please login with Google" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
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
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Google OAuth callback
exports.googleCallback = (req, res) => {
  try {
    // Generate token for the authenticated user
    const token = generateToken(req.user);

    // Redirect to frontend with token
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/google/callback?token=${token}`
    );
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect(
      `${process.env.FRONTEND_URL}/login?error=authentication_failed`
    );
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
