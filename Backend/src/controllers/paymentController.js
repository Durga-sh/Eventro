const Razorpay = require("razorpay");
const Ticket = require("../models/Ticket");
const Event = require("../models/Event");
const { createTicket } = require("./ticketController");
const crypto = require("crypto");

// const razorpay = new Razorpay({
//   key_id: require("../config/config").RAZORPAY_KEY_ID,
//   key_secret: require("../config/config").RAZORPAY_KEY_SECRET,
// });

// Create payment order
exports.createPaymentOrder = async (req, res) => {
  try {
    const { eventId, ticketTypeId, quantity } = req.body;

    // Validate request data
    if (!eventId || !ticketTypeId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Get event details
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Find ticket type
    const ticketType = event.ticketTypes.id(ticketTypeId);
    if (!ticketType) {
      return res.status(404).json({ message: "Ticket type not found" });
    }

    // Check availability
    if (ticketType.available < quantity) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    // Calculate amount
    const amount = ticketType.price * quantity * 100; // Razorpay requires amount in paise

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${eventId}_${Date.now()}`,
      notes: {
        eventId,
        ticketTypeId,
        quantity: quantity.toString(),
        userId: req.user.id,
      },
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: require("../config/config").RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create payment order error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Process payment webhook
exports.handleWebhook = async (req, res) => {
  try {
    const webhookSecret = require("../config/config").RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const event = req.body;

    // Handle payment success event
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const { eventId, ticketTypeId, quantity, userId } = payment.notes;

      // Create ticket
      await createTicket(
        eventId,
        userId,
        ticketTypeId,
        parseInt(quantity),
        payment.id
      );
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).json({ message: `Webhook Error: ${error.message}` });
  }
};
