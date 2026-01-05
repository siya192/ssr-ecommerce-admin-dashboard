"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const admins = JSON.parse(localStorage.getItem("admins") || "[]");

    const found = admins.find(
      (admin: any) =>
        admin.email === email && admin.password === password
    );

    if (!found) {
      alert("Invalid admin credentials");
      return;
    }

    // ✅ login success
    document.cookie = "role=admin; path=/";
    localStorage.setItem("loggedAdmin", email);

    router.push("/admin");
  }; // ✅ THIS WAS MISSING
  

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-4 py-2 " +
    "text-slate-900 bg-white placeholder:text-slate-500 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-1 text-center">
          Admin Login
        </h1>

        <p className="text-slate-600 text-center mb-6">
          Only authorized admins can access the dashboard
        </p>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-800 mb-1">
            Email
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
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
        >
          Login
        </button>
      </div>
    </div>
  );
}
