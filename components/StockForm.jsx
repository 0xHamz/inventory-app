"use client";
import { doc, updateDoc, addDoc, collection, increment, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function StockForm({ productId, type }) {
  const updateStock = async (qty = 1) => {
    const ref = doc(db, "products", productId);
    await updateDoc(ref, { stock: increment(type === "IN" ? qty : -qty) });
    await addDoc(collection(db, "stock_logs"), {
      productId,
      type,
      qty,
      user: auth.currentUser.email,
      createdAt: serverTimestamp(),
    });
  };

  return (
    <button onClick={() => updateStock()} className={`px-2 py-1 rounded ${type === "IN" ? "bg-green-500" : "bg-red-500"} text-white`}>
      {type} Stock
    </button>
  );
}
