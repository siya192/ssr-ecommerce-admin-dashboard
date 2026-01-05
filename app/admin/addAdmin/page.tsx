"use client";

import { useEffect, useState } from "react";

export default function AddAdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      setAllowed(true);
    } else {
      window.location.href = "/login";
    }
  }, []);

  const handleAddAdmin = () => {
    if (!email || !password) {
      alert("Fill all fields");
      return;
    }

    const admins = JSON.parse(localStorage.getItem("admins") || "[]");

    admins.push({
      id: Date.now(),
      email,
      password,
    });

    localStorage.setItem("admins", JSON.stringify(admins));

    alert("Admin added successfully");
    setEmail("");
    setPassword("");
  };

  if (!allowed) return null;

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-4 py-2 " +
    "text-slate-900 bg-white placeholder:text-slate-500 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="max-w-xl bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">
        Add New Admin
      </h1>
      <p className="text-slate-600 mb-6">
        Only existing admins can create new admins
      </p>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-800 mb-1">
          Admin Email
        </label>
        <input
          type="email"
          className={inputClass}
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-800 mb-1">
          Password
        </label>
        <input
          type="password"
          className={inputClass}
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        onClick={handleAddAdmin}
        className="w-full bg-blue-600 hover:bg-blue-700
                   text-white py-2 rounded-lg font-semibold"
      >
        Create Admin
      </button>
    </div>
  );
}


