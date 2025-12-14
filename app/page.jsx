import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-3xl w-full px-6 text-center">
        
        {/* Judul */}
        <h1 className="text-4xl font-bold text-gray-800">
          Inventory Management System
        </h1>

        <p className="mt-3 text-gray-600">
          Sistem inventaris modern dengan tracking stok, QR Code,
          dan audit log berbasis Next.js & Firebase.
        </p>

        {/* Tombol */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition"
          >
            Login
          </Link>

          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg bg-white border hover:bg-gray-100 transition"
          >
            Dashboard
          </Link>

          <Link
            href="/scan"
            className="px-6 py-3 rounded-lg bg-white border hover:bg-gray-100 transition"
          >
            Scan QR
          </Link>
        </div>

        {/* Feature */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <Feature
            title="Stock Tracking"
            desc="Pantau stok barang masuk & keluar secara real-time."
          />
          <Feature
            title="QR Code System"
            desc="Scan QR untuk melihat detail barang dengan cepat."
          />
          <Feature
            title="Audit Log"
            desc="Semua perubahan stok tercatat dan tidak bisa dihapus."
          />
        </div>

        {/* Footer kecil */}
        <p className="mt-10 text-xs text-gray-400">
          Built with Next.js, Firebase & QR Code
        </p>
      </div>
    </main>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{desc}</p>
    </div>
  );
}
