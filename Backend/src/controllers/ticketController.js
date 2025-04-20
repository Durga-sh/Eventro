/**
 * EVENT MANAGEMENT & TICKET BOOKING SYSTEM
 * 
 * Features:
 * - OAuth2 Authentication (Google)
 * - Event creation by organizers (admin)
 * - Ticket purchase with payment gateway (Stripe)
 * - QR code generation for booked tickets
 */

/**
 * FOLDER STRUCTURE:
 * 
 * event-booking-system/
 * ├── config/
 * │   ├── db.js
 * │   ├── passport.js
 * │   └── config.js
 * ├── controllers/
 * │   ├── authController.js
 * │   ├── eventController.js
 * │   ├── ticketController.js
 * │   └── paymentController.js
 * ├── middleware/
 * │   ├── auth.js
 * │   └── admin.js
 * ├── models/
 * │   ├── User.js
 * │   ├── Event.js
 * │   └── Ticket.js
 * ├── routes/
 * │   ├── auth.js
 * │   ├── events.js
 * │   ├── tickets.js
 * │   └── payments.js
 * ├── utils/
 * │   ├── qrCodeGenerator.js
 * │   └── emailService.js
 * ├── .env
 * ├── .gitignore
 * ├── app.js
 * ├── package.json
 * └── server.js
 */

/********* config/config.js *********/
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  FRONTEND_URL: process.env.FRONTEND_URL
};

/********* config/db.js *********/
const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

/********* config/passport.js *********/
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const config = require('./config');

// JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: config.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists
    let user = await User.findOne({ googleId: profile.id });
    
    if (!user) {
      // Create new user
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        avatar: profile.photos[0].value
      });
      await user.save();
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

module.exports = passport;

/********* models/User.js *********/
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  googleId: {
    type: String
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (this.password && this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function(enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);

/********* models/Event.js *********/
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  location: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ticketTypes: [
    {
      name: {
        type: String,
        required: true
      },
      description: {
        type: String
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      available: {
        type: Number,
        required: true
      }
    }
  ],
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled'],
    default: 'draft'
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', EventSchema);

/********* models/Ticket.js *********/
const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ticketType: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  unitPrice: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentId: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  qrCode: {
    type: String
  },
  ticketNumber: {
    type: String,
    unique: true
  },
  isCheckedIn: {
    type: Boolean,
    default: false
  },
  purchasedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate unique ticket number before saving
TicketSchema.pre('save', async function(next) {
  if (!this.ticketNumber) {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000);
    this.ticketNumber = `TKT-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Ticket', TicketSchema);

/********* middleware/auth.js *********/
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Authentication middleware
exports.authenticate = passport.authenticate('jwt', { session: false });

// Generate JWT token
exports.generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    config.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized access - please log in' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

/********* middleware/admin.js *********/
// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

/********* utils/qrCodeGenerator.js *********/
const QRCode = require('qrcode');
const crypto = require('crypto');

// Generate QR code for a ticket
exports.generateTicketQR = async (ticketData) => {
  try {
    // Create a secure hash of ticket data
    const dataString = JSON.stringify({
      ticketId: ticketData._id.toString(),
      eventId: ticketData.event.toString(),
      ticketNumber: ticketData.ticketNumber,
      userId: ticketData.user.toString()
    });
    
    const hash = crypto.createHmac('sha256', process.env.JWT_SECRET)
      .update(dataString)
      .digest('hex');
    
    // Data to encode in QR
    const qrData = JSON.stringify({
      ticketNumber: ticketData.ticketNumber,
      hash
    });
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrData);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
};

// Verify QR code data
exports.verifyQRCode = (qrData, ticketData) => {
  try {
    const parsedQRData = JSON.parse(qrData);
    
    // Recreate the hash from ticket data
    const dataString = JSON.stringify({
      ticketId: ticketData._id.toString(),
      eventId: ticketData.event.toString(),
      ticketNumber: ticketData.ticketNumber,
      userId: ticketData.user.toString()
    });
    
    const hash = crypto.createHmac('sha256', process.env.JWT_SECRET)
      .update(dataString)
      .digest('hex');
    
    // Compare hash from QR code with recalculated hash
    return parsedQRData.hash === hash && parsedQRData.ticketNumber === ticketData.ticketNumber;
  } catch (error) {
    console.error('QR Code verification error:', error);
    return false;
  }
};

/********* utils/emailService.js *********/
const nodemailer = require('nodemailer');
const config = require('../config/config');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS
  }
});

// Send email with ticket details
exports.sendTicketEmail = async (user, ticket, event, qrCode) => {
  try {
    const mailOptions = {
      from: config.EMAIL_USER,
      to: user.email,
      subject: `Your Ticket for ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Ticket Details</h2>
          <p>Thank you for purchasing a ticket for ${event.title}!</p>
          
          <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3>${event.title}</h3>
            <p><strong>Date:</strong> ${new Date(event.startDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date(event.startDate).toLocaleTimeString()}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Ticket Type:</strong> ${ticket.ticketType}</p>
            <p><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>
            <p><strong>Quantity:</strong> ${ticket.quantity}</p>
          </div>
          
          <div style="text-align: center; margin-bottom: 20px;">
            <p>Please present this QR code at the event entrance:</p>
            <img src="${qrCode}" alt="Ticket QR Code" style="max-width: 200px;">
          </div>
          
          <p>We look forward to seeing you at the event!</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Ticket email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

/********* controllers/authController.js *********/
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    user = new User({
      name,
      email,
      password
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
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // If user signed up with Google and doesn't have a password
    if (!user.password) {
      return res.status(400).json({ message: 'Please login with Google' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
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
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Google OAuth callback
exports.googleCallback = (req, res) => {
  try {
    // Generate token for the authenticated user
    const token = generateToken(req.user);
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?token=${token}`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/********* controllers/eventController.js *********/
const Event = require('../models/Event');

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      location,
      startDate,
      endDate,
      ticketTypes,
      tags,
      status
    } = req.body;
    
    // Create new event
    const event = new Event({
      title,
      description,
      image,
      location,
      startDate,
      endDate,
      organizer: req.user.id,
      ticketTypes: ticketTypes.map(ticket => ({
        ...ticket,
        available: ticket.quantity // Initially, all tickets are available
      })),
      tags,
      status: status || 'draft'
    });
    
    await event.save();
    
    res.status(201).json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const { status, search, startDate, endDate, sort } = req.query;
    const query = {};
    
    // Filter by status
    if (status) {
      query.status = status;
    } else {
      // By default, show only published events to regular users
      if (!req.user || req.user.role !== 'admin') {
        query.status = 'published';
      }
    }
    
    // Search by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    // Filter by date range
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) {
        query.startDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.startDate.$lte = new Date(endDate);
      }
    }
    
    // Sorting
    let sortOption = { startDate: 1 }; // Default: sort by start date ascending
    if (sort === 'dateDesc') {
      sortOption = { startDate: -1 };
    } else if (sort === 'titleAsc') {
      sortOption = { title: 1 };
    } else if (sort === 'titleDesc') {
      sortOption = { title: -1 };
    }
    
    const events = await Event.find(query)
      .sort(sortOption)
      .populate('organizer', 'name email');
    
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single event
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // If event is not published and user is not admin or organizer
    if (
      event.status !== 'published' && 
      (!req.user || 
        (req.user.role !== 'admin' && 
         event.organizer._id.toString() !== req.user.id))
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is admin or event organizer
    if (
      req.user.role !== 'admin' && 
      event.organizer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const {
      title,
      description,
      image,
      location,
      startDate,
      endDate,
      ticketTypes,
      tags,
      status
    } = req.body;
    
    // Update event fields
    if (title) event.title = title;
    if (description) event.description = description;
    if (image) event.image = image;
    if (location) event.location = location;
    if (startDate) event.startDate = startDate;
    if (endDate) event.endDate = endDate;
    if (tags) event.tags = tags;
    if (status) event.status = status;
    
    // Handle ticket types updates carefully to maintain available counts
    if (ticketTypes) {
      // For each existing ticket type, maintain the correct available count
      event.ticketTypes = ticketTypes.map(newTicket => {
        // Find corresponding existing ticket type
        const existingTicket = event.ticketTypes.find(t => t._id && t._id.toString() === newTicket._id);
        
        if (existingTicket) {
          // Calculate difference in quantity
          const quantityDiff = newTicket.quantity - existingTicket.quantity;
          // Update available accordingly
          return {
            ...newTicket,
            available: Math.max(0, existingTicket.available + quantityDiff)
          };
        } else {
          // New ticket type
          return {
            ...newTicket,
            available: newTicket.quantity
          };
        }
      });
    }
    
    await event.save();
    
    res.json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is admin or event organizer
    if (
      req.user.role !== 'admin' && 
      event.organizer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await event.remove();
    
    res.json({ success: true, message: 'Event removed' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get events created by current user
exports.getUserEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(events);
  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/********* controllers/ticketController.js *********/
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');
const { generateTicketQR, verifyQRCode } = require('../utils/qrCodeGenerator');
const { sendTicketEmail } = require('../utils/emailService');

// Get user's tickets
exports.getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id })
      .populate({
        path: 'event',
        select: 'title startDate location image'
      })
      .sort({ purchasedAt: -1 });
    
    res.json(tickets);
  } catch (error) {
    console.error('Get user tickets error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single ticket
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate({
        path: 'event',
        select: 'title description startDate endDate location image organizer'
      })
      .populate({
        path: 'user',
        select: 'name email'
      });
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Check if user is ticket owner, admin, or event organizer
    if (
      ticket.user._id.toString() !== req.user.id &&
      req.user.role !== 'admin' &&
      ticket.event.organizer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(ticket);
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create ticket (reserved for internal use after payment)
exports.createTicket = async (eventId, userId, ticketTypeId, quantity, paymentId) => {
  try {
    // Get event details
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    
    // Find ticket type
    const ticketType = event.ticketTypes.id(ticketTypeId);
    if (!ticketType) {
      throw new Error('Ticket type not found');
    }
    
    // Check availability
    if (ticketType.available < quantity) {
      throw new Error('Not enough tickets available');
    }
    
    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
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
      paymentStatus: 'completed'
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
    console.error('Create ticket error:', error);
    throw error;
  }
};

// Verify ticket for check-in
exports.verifyTicket = async (req, res) => {
  try {
    const { ticketId, qrData } = req.body;
    
    const ticket = await Ticket.findById(ticketId)
      .populate('event');
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Check if user is admin or event organizer
    if (
      req.user.role !== 'admin' && 
      ticket.event.organizer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Check if ticket is already checked in
    if (ticket.isCheckedIn) {
      return res.status(400).json({ message: 'Ticket already used for check-in' });
    }
    
    // Verify QR code
    const isValid = verifyQRCode(qrData, ticket);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid QR code' });
    }
    
    // Mark ticket as checked in
    ticket.isCheckedIn = true;
    await ticket.save();
    
    res.json({
      success: true,
      message: 'Ticket verified successfully',
      ticket
    });
  } catch (error) {
    console.error('Verify ticket error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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