"use client";

import { motion } from "framer-motion";
import { Lock, LogIn, User } from "lucide-react";
import type React from "react";
import { useState } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsLoggedIn(true);
        setUsername("");
        setPassword("");
      } else {
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto">
          <Card className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-minecraft-grass text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
              <p className="text-minecraft-grass-light">
                You are now logged in and can upload resource packs.
              </p>
            </motion.div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-minecraft-dirt-light">
      <div className="max-w-md mx-auto">
        <Card className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-6">
              <LogIn className="w-12 h-12 mx-auto mb-4 text-minecraft-grass" />
              <h2 className="text-2xl font-bold">Admin Login</h2>
              <p className="text-gray-300 mt-2">
                Sign in to manage resource packs
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-minecraft-stone-dark border border-minecraft-stone text-white rounded minecraft-border focus:outline-none focus:ring-2 focus:ring-minecraft-grass"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-minecraft-stone-dark border border-minecraft-stone text-white rounded minecraft-border focus:outline-none focus:ring-2 focus:ring-minecraft-grass"
                  required
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                variant="grass"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </motion.div>
        </Card>
      </div>
    </section>
  );
};

export default LoginForm;
