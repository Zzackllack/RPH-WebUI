"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useToast } from "@/app/contexts/ToastContext";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Lock, User, X } from "lucide-react";
import { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = await login(formData.username, formData.password);
    if (success) {
      addToast({
        type: "success",
        title: "Welcome!",
        message: "You have been successfully logged in.",
      });
      onClose();
    } else {
      setError("Invalid username or password.");
      addToast({
        type: "error",
        title: "Authentication failed",
        message: "Invalid username or password.",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-strong overflow-y-auto animate-fade-in"
        style={{ minHeight: "100vh" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ duration: 0.35, type: "spring", bounce: 0.25 }}
          className="minecraft-card glass-effect glow-effect w-full max-w-md p-8 relative animate-fade-in-scale max-h-[90vh] overflow-y-auto"
          style={{ boxSizing: "border-box" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-emerald-600 to-green-600 bg-clip-text text-transparent text-glow">
              Login to RPH-WebUI
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-primary/10 focus-ring transition-colors focus:outline-none"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-primary" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="minecraft-input pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-colors"
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="minecraft-input pl-10 pr-12 py-3 focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-colors"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/70 hover:text-primary focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-1 animate-bounce-subtle">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="minecraft-button w-full py-3 text-lg font-bold shadow-lg pulse-glow transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Please wait..." : "Sign In"}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
