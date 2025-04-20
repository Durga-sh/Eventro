const nodemailer = require("nodemailer");
const config = require("../config/config");

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
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
            <p><strong>Date:</strong> ${new Date(
              event.startDate
            ).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date(
              event.startDate
            ).toLocaleTimeString()}</p>
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
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Ticket email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};
