import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function StockChart({ products }) {
  const data = [];
  const map = {};
  products.forEach((p) => {
    map[p.location] = (map[p.location] || 0) + p.stock;
  });
  for (const loc in map) {
    data.push({ location: loc, stock: map[loc] });
  }

  return (
    <div className="mb-6 bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Stock per Location</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="location" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="stock" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
