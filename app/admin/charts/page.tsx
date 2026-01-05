"use client";

import useSWR from "swr";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Product = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
};

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#dc2626"];

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
};

export default function ChartsPage() {
  const { data: products, error, isLoading } = useSWR<Product[]>(
    "/api/products",
    fetcher
  );

  if (isLoading) return <p className="p-6">Loading charts…</p>;
  if (error) return <p className="p-6 text-red-600">Failed to load products</p>;
  if (!products || products.length === 0)
    return <p className="p-6">No product data available</p>;

  const stockData = products.map(p => ({
    name: p.name,
    quantity: p.quantity,
  }));

  const revenueData = products.map(p => ({
    name: p.name,
    revenue: p.price * p.quantity,
  }));

  const categoryMap: Record<string, number> = {};
  products.forEach(p => {
    categoryMap[p.category] =
      (categoryMap[p.category] || 0) + p.quantity;
  });

  const categoryData = Object.entries(categoryMap).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <div className="space-y-10">
      {/* Stock */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Stock Quantity per Product</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Revenue per Product</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Category-wise Stock</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" label>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}





