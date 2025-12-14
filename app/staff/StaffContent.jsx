"use client";

import { useEffect, useState, useRef } from "react";
import { collection, doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import StockForm from "@/components/StockForm";
import QRCodeBox from "@/components/QRCodeBox";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter, usePathname } from "next/navigation";

export default function StaffContent() {
  const [products, setProducts] = useState([]);
  const [scannedProduct, setScannedProduct] = useState(null); // Hanya produk hasil scan
  const scannerRef = useRef(null); 
  const role = "staff";
  const router = useRouter();
  const pathname = usePathname(); 

  // 🔹 Listener realtime untuk semua produk (tidak mengganggu scan)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Jalankan scanner hanya jika di halaman staff
  useEffect(() => {
    if (pathname !== "/staff") {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
      return;
    }

    if (!scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: 250 },
        false
      );
      scannerRef.current = scanner;

      scanner.render(
        async (decodedText) => {
          // Ambil data produk dari Firestore berdasarkan hasil scan
          const docRef = doc(db, "products", decodedText.split("/").pop());
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setScannedProduct({ id: docSnap.id, ...docSnap.data() });
          } else {
            setScannedProduct(null);
            alert("Produk tidak ditemukan!");
          }

          scanner.clear();
          scannerRef.current = null;
        },
        () => {}
      );
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role={role} />
      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Staff Dashboard</h1>

        {/* QR Scanner */}
        <div className="mb-6 flex justify-center">
          <div id="reader" className="w-80" />
        </div>

        {/* Produk hasil scan */}
        {scannedProduct && (
          <div className="mb-6 bg-white border rounded-xl shadow-md p-4 text-center max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{scannedProduct.name}</h2>
            <p className="text-gray-500 mb-1">
              Stock: <span className="font-medium">{scannedProduct.stock}</span>
            </p>
            <p className="text-gray-500 mb-2">
              Location: <span className="font-medium">{scannedProduct.location}</span>
            </p>
            <div className="flex justify-center gap-4 mb-2">
              <StockForm productId={scannedProduct.id} type="IN" />
              <StockForm productId={scannedProduct.id} type="OUT" />
            </div>
            <div className="flex justify-center">
              <QRCodeBox value={`/products/${scannedProduct.id}`} />
            </div>
          </div>
        )}

        {/* Daftar produk normal */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-center">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-xl shadow-md px-2 py-4 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">{product.name}</h2>
              <p className="text-gray-500 mb-1 text-center">
                Stock: <span className="font-medium">{product.stock}</span>
              </p>
              <p className="text-gray-500 mb-2 text-center">
                Location: <span className="font-medium">{product.location}</span>
              </p>
              <div className="flex justify-center gap-4 mb-2">
                <StockForm productId={product.id} type="IN" />
                <StockForm productId={product.id} type="OUT" />
              </div>
              <div className="flex justify-center">
                <QRCodeBox value={`/products/${product.id}`} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
