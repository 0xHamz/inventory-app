"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import ProductForm from "@/components/ProductForm";
import StockForm from "@/components/StockForm";
import QRCodeBox from "@/components/QRCodeBox";
import SummaryDashboard from "@/components/SummaryDashboard";
import StockChart from "@/components/StockChart";

export default function DashboardContent() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name"); // name, stock, timestamp
  const [sortOrder, setSortOrder] = useState("asc"); // asc / desc
  const role = "admin";

  // 🔹 Real-time listener
  useEffect(() => {
    const q = query(collection(db, "products"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    });
    return () => unsubscribe();
  }, []);

  const deleteProduct = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      await deleteDoc(doc(db, "products", id));
    }
  };

  const editProduct = async (id, updatedData) => {
    await updateDoc(doc(db, "products", id), updatedData);
  };

  // 🔹 Filter
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === "timestamp") {
      valA = valA?.seconds || 0;
      valB = valB?.seconds || 0;
    }

    if (typeof valA === "string") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role={role} />
      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Inventory Dashboard</h1>

        {/* Summary & Charts */}
        <SummaryDashboard products={products} />
        <StockChart products={products} />

        {/* Form tambah */}
        <div className="mb-4">
          <ProductForm />
        </div>

        {/* Search & Sorting */}
        <div className="mb-4 flex flex-col sm:flex-row justify-center gap-2 items-center">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-2 py-1 rounded w-full sm:w-1/3"
          />
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="name">Sort by Name</option>
            <option value="stock">Sort by Stock</option>
            <option value="timestamp">Sort by Date Added</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {/* Grid Produk */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-center">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-xl shadow-md px-1 py-4 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">{product.name}</h2>
              <p className="text-gray-500 mb-1 text-center">
                Stock: <span className="font-medium">{product.stock}</span>
              </p>
              <p className="text-gray-500 mb-2 text-center">
                Location: <span className="font-medium">{product.location}</span>
              </p>

              {/* Stock IN / OUT */}
              <div className="flex justify-center gap-4 mb-2">
                <StockForm productId={product.id} type="IN" />
                <StockForm productId={product.id} type="OUT" />
              </div>

              {/* Edit / Delete */}
              <div className="flex justify-center gap-2 mb-2">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => {
                    const newName = prompt("Edit nama produk:", product.name);
                    const newLocation = prompt("Edit lokasi:", product.location);
                    const newStock = prompt("Edit stock:", product.stock);
                    if (newName && newLocation && newStock !== null) {
                      editProduct(product.id, {
                        name: newName,
                        location: newLocation,
                        stock: Number(newStock),
                      });
                    }
                  }}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => deleteProduct(product.id)}
                >
                  Delete
                </button>
              </div>

              {/* QR Code */}
              <div className="flex justify-center">
                <QRCodeBox value={`${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.id}`} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
