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
        <div className="flex justify-center">
          <div id="reader" className="w-80" />
        </div>
      </main>
    </div>
  );
}
