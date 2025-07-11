'use client';

import { AuthModal } from '@/app/components/auth/AuthModal';
import { useAuth } from '@/app/contexts/AuthContext';
import { useTheme } from '@/app/contexts/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Menu, Moon, Settings, Sun, Upload, User, X } from 'lucide-react';
import { useState } from 'react';
import { MinecraftLogo } from '../ui/MinecraftLogo';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-strong bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-800/50 shadow-lg shadow-black/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Minecraft Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="relative">
              <MinecraftLogo className="w-10 h-10" />
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-emerald-500 rounded-xl blur opacity-20 animate-pulse"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
              RPH-WebUI
            </span>
          </motion.div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="px-4 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 font-medium"
            >
              Packs
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="px-4 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 font-medium"
            >
              Upload
            </motion.a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Dark mode toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="relative p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300"
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5 text-orange-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5 text-indigo-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-3 p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={'https://images.pexels.com/photos/2007647/pexels-photo-2007647.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1'}
                      alt="Profile"
                      className="w-8 h-8 rounded-xl object-cover"
                    />
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-emerald-500 rounded-xl blur opacity-30"></div>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user?.username}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-3 w-56 minecraft-card p-2 space-y-1"
                    >
                      <motion.a
                        whileHover={{ scale: 1.02, x: 4 }}
                        href="#"
                        className="flex items-center space-x-3 px-3 py-2 text-sm rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200 transition-all duration-200"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.02, x: 4 }}
                        href="#"
                        className="flex items-center space-x-3 px-3 py-2 text-sm rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200 transition-all duration-200"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Pack</span>
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.02, x: 4 }}
                        href="#"
                        className="flex items-center space-x-3 px-3 py-2 text-sm rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200 transition-all duration-200"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </motion.a>
                      <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                      <motion.button
                        whileHover={{ scale: 1.02, x: 4 }}
                        onClick={logout}
                        className="flex items-center space-x-3 px-3 py-2 text-sm rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left text-red-600 dark:text-red-400 transition-all duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAuthModalOpen(true)}
                className="minecraft-button px-6 py-2 text-sm font-semibold"
              >
                Sign In
              </motion.button>
            )}

            {/* Mobile menu toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden border-t border-white/20 dark:border-gray-800/50 py-4 space-y-2"
            >
              <motion.a
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                href="#"
                className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-200 font-medium"
              >
                Packs
              </motion.a>
              <motion.a
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                href="#"
                className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-200 font-medium"
              >
                Upload
              </motion.a>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}