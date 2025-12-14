"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import StockForm from "@/components/StockForm";
import QRCodeBox from "@/components/QRCodeBox";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;
  const [product, setProduct] = useState(null);
  const role = "staff";

  // 🔹 Listener real-time untuk produk ini
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const docRef = doc(db, "products", productId);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      setProduct({ id: docSnap.id, ...docSnap.data() });
    } else {
      setProduct(null);
    }
    setLoading(false);
  });
  return () => unsubscribe();
}, [productId]);

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  );
}

if (!product) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Produk tidak ditemukan atau telah dihapus</p>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role={role} />

      <main className="p-6 max-w-md mx-auto">
        {/* Tombol kembali */}
        <div className="mb-4">
          <button
            onClick={() => router.push("/staff")} // arahkan ke staff dashboard
            className="bg-gray-200 text-gray-800 px-4 py-1 rounded hover:bg-gray-300"
          >
            ← Kembali ke Dashboard
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-4 text-center">{product.name}</h1>

        <p className="text-gray-500 mb-2 text-center">
          Stock: <span className="font-medium">{product.stock}</span>
        </p>
        <p className="text-gray-500 mb-4 text-center">
          Location: <span className="font-medium">{product.location}</span>
        </p>

        {/* Stock IN / OUT */}
        <div className="flex justify-center gap-4 mb-4">
          <StockForm productId={product.id} type="IN" />
          <StockForm productId={product.id} type="OUT" />
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <QRCodeBox value={`http://localhost:3000/products/${product.id}`} />
        </div>
      </main>
    </div>
  );
}
