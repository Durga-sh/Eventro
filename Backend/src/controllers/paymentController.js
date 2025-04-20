const stripe = require("stripe")(require("../config/config").STRIPE_SECRET_KEY);
const Ticket = require("../models/Ticket");
const Event = require("../models/Event");
const { createTicket } = require("./ticketController");

// Create payment intent
exports.createPaymentIntent = async (req, res) => {
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
    const amount = ticketType.price * quantity * 100; // Stripe requires amount in cents

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: {
        eventId,
        ticketTypeId,
        quantity,
        userId: req.user.id,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Create payment intent error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Process payment webhook
exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = require("../config/config").STRIPE_WEBHOOK_SECRET;

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    // Handle the event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const { eventId, ticketTypeId, quantity, userId } =
        paymentIntent.metadata;

      // Create ticket
      await createTicket(
        eventId,
        userId,
        ticketTypeId,
        parseInt(quantity),
        paymentIntent.id
      );
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
