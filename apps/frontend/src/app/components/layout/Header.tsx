"use client";

import { AuthModal } from "@/app/components/auth/AuthModal";
import { useAuth } from "@/app/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { MinecraftLogo } from "../ui/MinecraftLogo";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-40 bg-gray-900 text-white">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3"
        >
          <MinecraftLogo className="w-8 h-8" />
          <span className="text-xl font-bold">RPH-WebUI</span>
        </motion.div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600">
                <User className="w-5 h-5 text-white" />
              </span>
              <span className="text-sm font-medium">{user?.username}</span>
              <button
                onClick={logout}
                className="p-2 rounded hover:bg-gray-800 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Login
            </button>
          )}

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-gray-900"
          >
            <a href="#" className="block px-4 py-2 hover:bg-gray-800">
              Packs
            </a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-800">
              Upload
            </a>
          </motion.nav>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}
