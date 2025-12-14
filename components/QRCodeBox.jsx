"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeBox({ value, size = 140 }) {
  const canvasRef = useRef(null);

  const downloadQR = () => {
    const canvas = canvasRef.current.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/jpeg");
    link.download = `QR-${value}.jpg`;
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={canvasRef}>
        <QRCodeCanvas value={value} size={size} />
      </div>
      <button
        onClick={downloadQR}
        className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 text-sm"
      >
        Download QR
      </button>
    </div>
  );
}
