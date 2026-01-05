"use client";

import useSWR from "swr";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function ProductsPage() {
  const {
    data: products,
    isLoading,
    error,
    mutate,
  } = useSWR<Product[]>("/api/products", fetcher);

  const deleteProduct = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
  
    if (!res.ok) {
      alert("Delete failed");
      return;
    }
  
    mutate(); // refresh product list
  };
  
  
  

  if (isLoading) {
    return <p className="text-slate-700">Loading products…</p>;
  }

  if (error) {
    return <p className="text-red-600">Failed to load products</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Product Management
        </h1>

        <Link
          href="/admin/products/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
        >
          + Add Product
        </Link>
      </div>

      {!products || products.length === 0 ? (
        <p className="text-slate-600">No products added yet.</p>
      ) : (
        <div className="space-y-4">
          {products.map((p) => (
            <div
              key={p._id}
              className="flex justify-between items-center border border-slate-300 rounded-xl p-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-14 h-14 object-cover rounded-lg border"
                />

                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    {p.name}
                  </p>
                  <p className="text-slate-700">
                    ₹{p.price} • Qty: {p.quantity} • {p.category}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/admin/products/edit/${p._id}`}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteProduct(p._id)}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}




