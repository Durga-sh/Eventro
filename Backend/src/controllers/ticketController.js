const Ticket = require("../models/Ticket");
const Event = require("../models/Event");
const User = require("../models/User");
const { generateTicketQR, verifyQRCode } = require("../utils/qrCodeGenerator");
const { sendTicketEmail } = require("../utils/emailService");

// Get user's tickets
exports.getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id })
      .populate({
        path: "event",
        select: "title startDate location image",
      })
      .sort({ purchasedAt: -1 });

    res.json(tickets);
  } catch (error) {
    console.error("Get user tickets error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single ticket
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate({
        path: "event",
        select: "title description startDate endDate location image organizer",
      })
      .populate({
        path: "user",
        select: "name email",
      });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check if user is ticket owner, admin, or event organizer
    if (
      ticket.user._id.toString() !== req.user.id &&
      req.user.role !== "admin" &&
      ticket.event.organizer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Get ticket error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create ticket endpoint (no payment required)
exports.createTicket = async (req, res) => {
  try {
    const { eventId, ticketTypeId, quantity } = req.body;
    const userId = req.user.id;

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

    // Create ticket
    const ticket = new Ticket({
      event: eventId,
      user: userId,
      ticketType: ticketType.name,
      quantity,
      unitPrice: ticketType.price,
      totalAmount: ticketType.price * quantity,
      paymentId: "free-booking-" + Date.now(), // Simple identifier for free bookings
      paymentStatus: "completed",
    });

    // Generate QR code
    const qrCode = await generateTicketQR(ticket);
    ticket.qrCode = qrCode;

    // Save ticket
    await ticket.save();

    // Update ticket availability
    ticketType.available -= quantity;
    await event.save();

    // Get user details for email
    const user = await User.findById(userId);

    // Send confirmation email
    await sendTicketEmail(user, ticket, event, qrCode);

    res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    console.error("Create ticket error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Helper function for internal ticket creation (reserved for internal use after payment)
exports.createTicketInternal = async (
  eventId,
  userId,
  ticketTypeId,
  quantity,
  paymentId
) => {
  try {
    // Get event details
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Find ticket type
    const ticketType = event.ticketTypes.id(ticketTypeId);
    if (!ticketType) {
      throw new Error("Ticket type not found");
    }

    // Check availability
    if (ticketType.available < quantity) {
      throw new Error("Not enough tickets available");
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Create ticket
    const ticket = new Ticket({
      event: eventId,
      user: userId,
      ticketType: ticketType.name,
      quantity,
      unitPrice: ticketType.price,
      totalAmount: ticketType.price * quantity,
      paymentId,
      paymentStatus: "completed",
    });

    // Generate QR code
    const qrCode = await generateTicketQR(ticket);
    ticket.qrCode = qrCode;

    // Save ticket
    await ticket.save();

    // Update ticket availability
    ticketType.available -= quantity;
    await event.save();

    // Send confirmation email
    await sendTicketEmail(user, ticket, event, qrCode);

    return ticket;
  } catch (error) {
    console.error("Create ticket error:", error);
    throw error;
  }
};



// Public ticket verification (for users scanning QR codes)
exports.publicVerifyTicket = async (req, res) => {
  try {
    const { ticketId, signature, timestamp } = req.body;
    
    if (!ticketId || !signature || !timestamp) {
      return res.status(400).json({ message: 'Missing required verification parameters' });
    }
    
    // Check if the link is too old (older than 30 days)
    const linkAge = Date.now() - parseInt(timestamp);
    if (linkAge > 30 * 24 * 60 * 60 * 1000) {
      return res.status(400).json({ message: 'Verification link has expired' });
    }
    
    const ticket = await Ticket.findById(ticketId)
      .populate({
        path: 'event',
        select: 'title startDate endDate location organizer'
      })
      .populate({
        path: 'user',
        select: 'name email'
      });
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Recreate the signature for verification
    const signatureData = `${ticketId}:${ticket.event._id}:${timestamp}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.JWT_SECRET || 'ticket-secret-key')
      .update(signatureData)
      .digest('hex')
      .substring(0, 16);
    
    if (signature !== expectedSignature) {
      return res.status(400).json({ message: 'Invalid ticket verification data' });
    }
    
    // Determine ticket status
    let status = 'Valid';
    if (ticket.isCheckedIn) {
      status = 'Used';
    } else if (new Date(ticket.event.startDate) < new Date()) {
      status = 'Expired';
    }
    
    // Return ticket details and status
    res.json({
      status,
      ticket: {
        _id: ticket._id,
        ticketNumber: ticket.ticketNumber,
        ticketType: ticket.ticketType,
        quantity: ticket.quantity,
        unitPrice: ticket.unitPrice,
        totalAmount: ticket.totalAmount,
        isCheckedIn: ticket.isCheckedIn,
        purchasedAt: ticket.purchasedAt,
        event: {
          title: ticket.event.title,
          startDate: ticket.event.startDate,
          endDate: ticket.event.endDate,
          location: ticket.event.location
        }
      }
    });
  } catch (error) {
    console.error('Public verify ticket error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Verify ticket for check-in
exports.verifyTicket = async (req, res) => {
  try {
    const { ticketId, qrData } = req.body;

    const ticket = await Ticket.findById(ticketId).populate("event");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check if user is admin or event organizer
    if (
      req.user.role !== "admin" &&
      ticket.event.organizer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if ticket is already checked in
    if (ticket.isCheckedIn) {
      return res
        .status(400)
        .json({ message: "Ticket already used for check-in" });
    }

    // Verify QR code
    const isValid = verifyQRCode(qrData, ticket);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid QR code" });
    }

    // Mark ticket as checked in
    ticket.isCheckedIn = true;
    await ticket.save();

    res.json({
      success: true,
      message: "Ticket verified successfully",
      ticket,
    });
  } catch (error) {
    console.error("Verify ticket error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get tickets for an event (admin/organizer only)
exports.getEventTickets = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is admin or event organizer
    if (
      req.user.role !== "admin" &&
      event.organizer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const tickets = await Ticket.find({ event: req.params.eventId })
      .populate({
        path: "user",
        select: "name email",
      })
      .sort({ purchasedAt: -1 });

    res.json(tickets);
  } catch (error) {
    console.error("Get event tickets error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
