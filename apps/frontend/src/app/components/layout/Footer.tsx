'use client';

import { motion } from 'framer-motion';
import { Code, Github, Heart, Twitter } from 'lucide-react';
import { MinecraftLogo } from '../ui/MinecraftLogo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative backdrop-blur-strong bg-white/80 dark:bg-gray-900/80 border-t border-white/20 dark:border-gray-800/50">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 to-transparent dark:from-gray-900/50 pointer-events-none"></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-3 mb-6"
            >
              <div className="relative">
                <MinecraftLogo className="w-10 h-10" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-900 bg-clip-text text-transparent">
                  RPH-WebUI
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Resource Pack Hub
                </p>
              </div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 dark:text-gray-300 max-w-md leading-relaxed mb-6"
            >
              Modern, secure resource pack hosting for Minecraft. Upload, manage, and share your 
              texture packs or implement them into your Server. Built with love for the Minecraft ecosystem.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
            >
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>from Zacklack</span>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center"
            >
              <Code className="w-4 h-4 mr-2 text-primary" />
              Quick Links
            </motion.h3>
            <motion.ul
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <li>
                <motion.a
                  whileHover={{ x: 4, scale: 1.02 }}
                  href="https://legal.zacklack.de/impressum/"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-all duration-200 flex items-center space-x-2"
                >
                  <span>Imprint</span>
                </motion.a>
              </li>
              <li>
                <motion.a
                  whileHover={{ x: 4, scale: 1.02 }}
                  href="https://legal.zacklack.de/datenschutz/"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-all duration-200 flex items-center space-x-2"
                >
                  <span>Privacy policy</span>
                </motion.a>
              </li>
              <li>
                <motion.a
                  whileHover={{ x: 4, scale: 1.02 }}
                  href="https://legal.zacklack.de/nutzungsbedingungen/"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-all duration-200 flex items-center space-x-2"
                >
                  <span>Terms of Use</span>
                </motion.a>
              </li>
              <li>
                <motion.a
                  whileHover={{ x: 4, scale: 1.02 }}
                  href="https://legal.zacklack.de/cookies/"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-all duration-200 flex items-center space-x-2"
                >
                  <span>Cookie Policy</span>
                </motion.a>
              </li>
            </motion.ul>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border-t border-gray-200/50 dark:border-gray-700/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {currentYear} RPH-WebUI. Crafted for the Minecraft community.
          </p>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <motion.a
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
            >
              <Github className="w-5 h-5" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
            >
              <Twitter className="w-5 h-5" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}