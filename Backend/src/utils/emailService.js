const nodemailer = require("nodemailer");
const config = require("../config/config");

// Enhanced transporter with better error handling
const createTransporter = () => {
  console.log("Creating email transporter with config:");
  console.log("Email User:", config.EMAIL_USER ? "✓ Set" : "✗ Missing");
  console.log("Email Pass:", config.EMAIL_PASS ? "✓ Set" : "✗ Missing");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
    debug: true, // Enable debug logging
    logger: true, // Enable logger
  });

  return transporter;
};

// Test email configuration
exports.testEmailConfig = async () => {
  try {
    console.log("Testing email configuration...");
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✓ Email configuration is valid and ready to send emails");
    return { success: true, message: "Email configuration verified" };
  } catch (error) {
    console.error("✗ Email configuration error:", error);
    return { success: false, error: error.message };
  }
};

// Send a simple test email
exports.sendTestEmail = async (recipientEmail) => {
  try {
    console.log(`Sending test email to: ${recipientEmail}`);
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Event Tickets Test" <${config.EMAIL_USER}>`,
      to: recipientEmail,
      subject: "Test Email - Event Ticket System",
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from your Event Ticket System.</p>
        <p>If you receive this, your email configuration is working correctly!</p>
        <p>Sent at: ${new Date().toLocaleString()}</p>
      `,
      text: `Test Email - Event Ticket System\n\nThis is a test email. If you receive this, your email configuration is working!\n\nSent at: ${new Date().toLocaleString()}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✓ Test email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("✗ Test email failed:", error);
    return { success: false, error: error.message };
  }
};

// Send email with ticket details
exports.sendTicketEmail = async (user, ticket, event, qrCode) => {
  console.log("=== STARTING EMAIL SEND PROCESS ===");
  console.log("Recipient:", user.email);
  console.log("Event:", event.title);
  console.log("Ticket Number:", ticket.ticketNumber);

  try {
    // Validate required parameters
    if (!user || !user.email) {
      throw new Error("User email is required");
    }

    if (!ticket) {
      throw new Error("Ticket data is required");
    }

    if (!event) {
      throw new Error("Event data is required");
    }

    console.log("✓ All required parameters validated");

    // Check email configuration
    if (!config.EMAIL_USER || !config.EMAIL_PASS) {
      throw new Error(
        "Email configuration missing. Please check EMAIL_USER and EMAIL_PASS in your config."
      );
    }

    console.log("✓ Email configuration validated");

    const transporter = createTransporter();

    // Test transporter before sending
    await transporter.verify();
    console.log("✓ Email transporter verified");

    // Format date and time for better readability
    const eventDate = new Date(event.startDate);
    const formattedDate = eventDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formattedTime = eventDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // Calculate total amount for display
    const totalAmount =
      ticket.totalAmount || ticket.unitPrice * ticket.quantity;

    console.log("✓ Email content prepared");

    const mailOptions = {
      from: `"Event Tickets" <${config.EMAIL_USER}>`,
      to: user.email,
      subject: `🎫 Your Ticket Confirmation for ${event.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Event Ticket</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 300; }
            .content { padding: 30px 20px; }
            .ticket-info { background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .event-details { background: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
            .detail-row:last-child { border-bottom: none; }
            .detail-label { font-weight: 600; color: #495057; }
            .detail-value { color: #212529; }
            .qr-section { text-align: center; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; }
            .qr-code { max-width: 200px; height: auto; border: 2px solid #dee2e6; border-radius: 8px; }
            .total-section { background: #667eea; color: white; padding: 15px 20px; margin: 20px 0; border-radius: 5px; text-align: center; }
            .footer { background: #212529; color: #adb5bd; padding: 20px; text-align: center; font-size: 14px; }
            .important-note { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎫 Event Ticket Confirmation</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your booking is confirmed!</p>
            </div>
            
            <div class="content">
              <p style="font-size: 16px; color: #495057; margin-bottom: 25px;">
                Dear <strong>${user.name}</strong>,
              </p>
              
              <p style="color: #495057; line-height: 1.6;">
                Thank you for your booking! Your ticket has been confirmed for <strong>${
                  event.title
                }</strong>.
              </p>

              <div class="event-details">
                <h3 style="margin-top: 0; color: #495057; font-size: 18px;">📅 Event Details</h3>
                
                <div class="detail-row">
                  <span class="detail-label">Event:</span>
                  <span class="detail-value"><strong>${
                    event.title
                  }</strong></span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span class="detail-value">${formattedDate}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Time:</span>
                  <span class="detail-value">${formattedTime}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Venue:</span>
                  <span class="detail-value">${event.location}</span>
                </div>
              </div>

              <div class="ticket-info">
                <h3 style="margin-top: 0; color: #495057; font-size: 18px;">🎟️ Ticket Information</h3>
                
                <div class="detail-row">
                  <span class="detail-label">Ticket Number:</span>
                  <span class="detail-value"><strong>${
                    ticket.ticketNumber
                  }</strong></span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Type:</span>
                  <span class="detail-value">${ticket.ticketType}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Quantity:</span>
                  <span class="detail-value">${ticket.quantity}</span>
                </div>
              </div>

              ${
                totalAmount > 0
                  ? `
              <div class="total-section">
                <h3 style="margin: 0;">Total: ₹${totalAmount.toLocaleString()}</h3>
              </div>
              `
                  : ""
              }

              ${
                qrCode
                  ? `
              <div class="qr-section">
                <h3 style="color: #495057; margin-bottom: 15px;">📱 Your QR Code</h3>
                <img src="${qrCode}" alt="Ticket QR Code" class="qr-code">
                <p style="color: #6c757d; margin-top: 15px;">Present this at the event entrance</p>
              </div>
              `
                  : ""
              }

              <div class="important-note">
                <h4 style="margin-top: 0;">Important:</h4>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Arrive 30 minutes early</li>
                  <li>Bring valid ID</li>
                  <li>Keep this email safe</li>
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <p style="margin: 0;">Event Management System</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        EVENT TICKET CONFIRMATION
        
        Dear ${user.name},
        
        Your ticket for ${event.title} is confirmed!
        
        Event: ${event.title}
        Date: ${formattedDate}
        Time: ${formattedTime}
        Venue: ${event.location}
        
        Ticket: ${ticket.ticketNumber}
        Type: ${ticket.ticketType}
        Quantity: ${ticket.quantity}
        
        Please arrive 30 minutes early with valid ID.
      `,
    };

    console.log("✓ Sending email...");
    const info = await transporter.sendMail(mailOptions);

    console.log("✓ EMAIL SENT SUCCESSFULLY!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
    console.log("=== EMAIL SEND COMPLETE ===");

    return {
      success: true,
      messageId: info.messageId,
      recipient: user.email,
      response: info.response,
    };
  } catch (error) {
    console.error("✗ EMAIL SEND FAILED!");
    console.error("Error details:", error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("=== EMAIL SEND FAILED ===");

    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }
};
