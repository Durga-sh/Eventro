const Razorpay = require("razorpay");
const Ticket = require("../models/Ticket");
const Event = require("../models/Event");
const { createTicket } = require("./ticketController");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: require("../config/config").RAZORPAY_KEY_ID,
  key_secret: require("../config/config").RAZORPAY_KEY_SECRET,
});

// Create payment order
exports.createPaymentOrder = async (req, res) => {
  try {
    const { eventId, ticketTypeId, quantity, contactInfo } = req.body;

    // Validate request data
    if (!eventId || !ticketTypeId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Validate contact info
    if (
      !contactInfo ||
      !contactInfo.name ||
      !contactInfo.email ||
      !contactInfo.phone
    ) {
      return res
        .status(400)
        .json({ message: "Contact information is required" });
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
        contactName: contactInfo.name,
        contactEmail: contactInfo.email,
        contactPhone: contactInfo.phone,
      },
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: require("../config/config").RAZORPAY_KEY_ID,
      eventTitle: event.title,
      ticketTypeName: ticketType.name,
      quantity: quantity,
      userEmail: req.user.email,
      userName: contactInfo.name,
      userPhone: contactInfo.phone,
    });
  } catch (error) {
    console.error("Create payment order error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", require("../config/config").RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment is verified, get order details
      const order = await razorpay.orders.fetch(razorpay_order_id);
      const payment = await razorpay.payments.fetch(razorpay_payment_id);

      if (payment.status === "captured") {
        const {
          eventId,
          ticketTypeId,
          quantity,
          userId,
          contactName,
          contactEmail,
          contactPhone,
        } = order.notes;

        // Create ticket
        const ticket = await createTicket(
          eventId,
          userId,
          ticketTypeId,
          parseInt(quantity),
          razorpay_payment_id,
          {
            name: contactName,
            email: contactEmail,
            phone: contactPhone,
          }
        );

        res.json({
          success: true,
          message: "Payment verified and ticket created successfully",
          ticketId: ticket._id,
          paymentId: razorpay_payment_id,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Payment not captured",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
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
      const {
        eventId,
        ticketTypeId,
        quantity,
        userId,
        contactName,
        contactEmail,
        contactPhone,
      } = payment.notes;

      // Check if ticket already exists for this payment
      const existingTicket = await Ticket.findOne({ paymentId: payment.id });
      if (!existingTicket) {
        // Create ticket
        await createTicket(
          eventId,
          userId,
          ticketTypeId,
          parseInt(quantity),
          payment.id,
          {
            name: contactName,
            email: contactEmail,
            phone: contactPhone,
          }
        );
      }
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).json({ message: `Webhook Error: ${error.message}` });
  }
};
