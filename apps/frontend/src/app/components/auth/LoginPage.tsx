"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useState } from "react";

export function LoginPage() {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = await login(username, password);
    if (success === false) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-8 w-full max-w-sm flex flex-col gap-6 minecraft-card animate-fade-in"
      >
        <h2 className="text-2xl font-bold text-center text-green-700 mb-2">RPH-WebUI Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none bg-white/70"
          autoFocus
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none bg-white/70"
        />
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
