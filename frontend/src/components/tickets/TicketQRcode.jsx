import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

const TicketQRCode = ({ qrData }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!qrData) {
      setQrCodeUrl("");
      setIsLoading(false);
      return;
    }

    const generateQR = async () => {
      try {
        setIsLoading(true);

        // Truncate data if it's too long - QR codes have capacity limits
        // Most QR codes can handle around 300 characters reliably at medium error correction
        const truncatedData =
          qrData.length > 250 ? qrData.substring(0, 250) + "..." : qrData;

        // Generate QR code as data URL with optimized settings
        const url = await QRCode.toDataURL(truncatedData, {
          width: 200,
          margin: 1,
          errorCorrectionLevel: "M", // L, M, Q, H - lower correction = more data capacity
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });

        setQrCodeUrl(url);
        setError(null);
      } catch (err) {
        console.error("Error generating QR code:", err);
        setError("Failed to generate QR code: " + err.message);

        // Fallback: try with even less data if first attempt failed
        if (qrData.length > 100) {
          try {
            const basicData = qrData.substring(0, 100) + "...";
            const url = await QRCode.toDataURL(basicData, {
              width: 200,
              margin: 1,
              errorCorrectionLevel: "L",
            });
            setQrCodeUrl(url);
            setError(null);
          } catch (fallbackErr) {
            setError("Could not generate QR code even with reduced data");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    generateQR();
  }, [qrData]);

  if (isLoading) {
    return (
      <div className="qr-code-loading">
        <p>Generating QR code...</p>
      </div>
    );
  }

  if (error && !qrCodeUrl) {
    return (
      <div className="qr-code-error">
        <p>{error}</p>
        <div className="mock-qr">
          <div className="qr-content">
            {qrData ? qrData.substring(0, 8) : "ERROR"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="qr-code-container">
      {qrCodeUrl ? (
        <>
          <img
            src={qrCodeUrl}
            alt="Ticket QR Code"
            className="ticket-qr-code"
          />
          {error && (
            <p className="qr-warning">Note: QR code contains truncated data</p>
          )}
          <p>Present this QR code at the event entrance</p>
        </>
      ) : (
        <div className="qr-code-placeholder">
          <div className="mock-qr">
            <div className="qr-content">
              {qrData ? qrData.substring(0, 8) : "TICKET"}
            </div>
          </div>
          <p>QR Code for check-in</p>
        </div>
      )}
    </div>
  );
};

export default TicketQRCode;
