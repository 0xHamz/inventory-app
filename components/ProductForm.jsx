"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ProductForm({ onAddProduct }) {
  const [name, setName] = useState("");
  const [stock, setStock] = useState(0);
  const [location, setLocation] = useState("");

  const addProduct = async () => {
    if (!name || !location) return alert("Nama dan lokasi wajib diisi");

    // Tambah produk ke Firestore
    const docRef = await addDoc(collection(db, "products"), {
      name,
      stock,
      location,
    });

    // Buat object produk baru
    const newProduct = {
      id: docRef.id,
      name,
      stock,
      location,
    };

    // Kirim produk baru ke DashboardContent
    if (onAddProduct) onAddProduct(newProduct);

    // Reset form
    setName("");
    setStock(0);
    setLocation("");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-2 py-1 rounded w-full sm:w-auto"
      />
      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(Number(e.target.value))}
        className="border px-2 py-1 rounded w-full sm:w-24"
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border px-2 py-1 rounded w-full sm:w-auto"
      />
      <button
        onClick={addProduct}
        className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 transition"
      >
        Add
      </button>
    </div>
  );
}
