import React from "react";

const TicketQRCode = ({ qrData }) => {
  // In a real app, you would use a QR code library like qrcode.react
  // For now, we'll just display a placeholder

  // If we had the qrcode.react library, we would use:
  // import QRCode from 'qrcode.react';
  // return <QRCode value={qrData} size={200} renderAs="svg" />;

  return (
    <div className="qr-code-placeholder">
      <div className="mock-qr">
        {/* Display the first 8 chars of the QR data */}
        <div className="qr-content">{(qrData || "TICKET").substring(0, 8)}</div>
      </div>
      <p>QR Code for check-in</p>
    </div>
  );
};

export default TicketQRCode;
