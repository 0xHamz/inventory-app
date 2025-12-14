"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function StaffContent() {
  const role = "staff";
  const router = useRouter();
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  const startScan = () => {
    setScanning(true);
    if (!scannerRef.current) {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
      scannerRef.current = scanner;
      scanner.render(
        (decodedText) => {
          router.push(decodedText); // langsung redirect ke link produk
          scanner.clear();
          scannerRef.current = null;
          setScanning(false);
        },
        () => {}
      );
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role={role} />
      <main className="p-6 max-w-7xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Staff Dashboard</h1>

        {/* Tombol Start Scan */}
        {!scanning && (
          <button
            onClick={startScan}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Start Scan
          </button>
        )}

        {/* QR Scanner */}
        <div className="mt-4 flex justify-center">
          <div id="reader" className="w-80" />
        </div>
      </main>
    </div>
  );
}
