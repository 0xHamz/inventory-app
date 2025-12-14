"use client";

import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function StaffContent() {
  const role = "staff";
  const router = useRouter();
  const pathname = usePathname();
  const scannerRef = useRef(null);

  useEffect(() => {
    // Hentikan scanner saat pindah halaman
    if (pathname !== "/staff") {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
      return;
    }

    // Jalankan scanner hanya jika belum ada instance
    if (!scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: 250 },
        false
      );
      scannerRef.current = scanner;

      scanner.render(
        (decodedText) => {
          router.push(decodedText); // redirect ke produk
          scanner.clear();
          scannerRef.current = null;
        },
        () => {}
      );
    }
  }, [pathname, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role={role} />
      <main className="p-6 max-w-7xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Staff Dashboard</h1>

        {/* QR Scanner */}
        <div className="flex justify-center mb-6">
          <div id="reader" className="w-80" />
        </div>

        {/* Instruksi cara pakai */}
        <div className="bg-white border rounded-xl shadow-md p-4 max-w-md mx-auto text-left space-y-2">
          <h2 className="font-bold text-lg mb-2 text-center">Cara Menggunakan Scanner</h2>
          <ol className="list-decimal list-inside text-gray-700">
            <li>
              <strong>Download QR Code</strong> dari link berikut:
              <ul className="list-disc ml-5 mt-1">
                <li><a href="https://ibb.co.com/m5FcxNh9" target="_blank" className="text-blue-600 underline">QR Link 1</a></li>
                <li><a href="https://ibb.co.com/mrM6hQYh" target="_blank" className="text-blue-600 underline">QR Link 2</a></li>
              </ul>
            </li>
            <li className="mt-2"><strong>Scan QR Code</strong> menggunakan kamera di atas dengan memilih file QR yang sudah di-download.</li>
            <li className="mt-2">Setelah berhasil scan, <strong>detail produk</strong> akan otomatis muncul.</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
