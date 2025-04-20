const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { isAuthenticated } = require("../middleware/auth");

// Create payment intent
router.post(
  "/create-payment-intent",
  isAuthenticated,
  paymentController.createPaymentIntent
);

// Stripe webhook
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook
);

module.exports = router;
