const QRCode = require("qrcode");
const crypto = require("crypto");

// Generate QR code for a ticket
exports.generateTicketQR = async (ticketData) => {
  try {
    // Create a secure hash of ticket data
    const dataString = JSON.stringify({
      ticketId: ticketData._id.toString(),
      eventId: ticketData.event.toString(),
      ticketNumber: ticketData.ticketNumber,
      userId: ticketData.user.toString(),
    });

    const hash = crypto
      .createHmac("sha256", process.env.JWT_SECRET)
      .update(dataString)
      .digest("hex");

    // Data to encode in QR
    const qrData = JSON.stringify({
      ticketNumber: ticketData.ticketNumber,
      hash,
    });

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrData);
    return qrCodeDataUrl;
  } catch (error) {
    console.error("QR Code generation error:", error);
    throw new Error("Failed to generate QR code");
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
      userId: ticketData.user.toString(),
    });

    const hash = crypto
      .createHmac("sha256", process.env.JWT_SECRET)
      .update(dataString)
      .digest("hex");

    // Compare hash from QR code with recalculated hash
    return (
      parsedQRData.hash === hash &&
      parsedQRData.ticketNumber === ticketData.ticketNumber
    );
  } catch (error) {
    console.error("QR Code verification error:", error);
    return false;
  }
};
