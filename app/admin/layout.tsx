"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // ✅ read role from cookie
    const hasAdminRole = document.cookie.includes("role=admin");
    setIsAdmin(hasAdminRole);
  }, []);

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-8">
          Admin Panel
        </h2>

        <nav className="space-y-4">
          <Link href="/admin" className="block text-slate-700 hover:text-blue-600 font-medium">
            Dashboard
          </Link>

          <Link href="/admin/products" className="block text-slate-700 hover:text-blue-600 font-medium">
            Products
          </Link>

          <Link href="/admin/charts" className="block text-slate-700 hover:text-blue-600 font-medium">
            Charts
          </Link>

          {/* 🔒 Admin-only onboarding */}
          {isAdmin && (
            <Link href="/admin/addAdmin" className="block text-slate-700 hover:text-blue-600 font-medium">
              Add Admin
            </Link>
          )}

          <button
            onClick={() => {
              // ✅ proper logout
              document.cookie = "role=; Max-Age=0; path=/";
              localStorage.removeItem("loggedAdmin");
              window.location.href = "/login";
            }}
            className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
