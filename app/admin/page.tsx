"use client";

import { useEffect } from "react";

export default function AdminPage() {
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-4">
        Dashboard
      </h1>
      <p className="text-slate-600">
        Welcome Admin. Use the sidebar to manage products.
      </p>
    </div>
  );
}






