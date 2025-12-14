export default function SummaryDashboard({ products }) {
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStock = products.filter((p) => p.stock < 5).length;

  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-gray-500">Total Products</p>
        <p className="text-xl font-bold">{totalProducts}</p>
      </div>
      <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-gray-500">Total Stock</p>
        <p className="text-xl font-bold">{totalStock}</p>
      </div>
      <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-gray-500">Low Stock (&lt;5)</p>
        <p className="text-xl font-bold">{lowStock}</p>
      </div>
    </div>
  );
}
