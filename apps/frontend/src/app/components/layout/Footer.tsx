'use client';

import { motion } from 'framer-motion';
import { Disc as Discord, Github, Package, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 mb-4"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center pixel-border">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">RPH-WebUI</span>
            </motion.div>
            <p className="text-gray-400 max-w-md">
              Minimal, modern resource pack hosting for Minecraft. Upload and manage your packs with ease.
            </p>
          </div>

          {/* Links */}
          {/* Minimal links, no community/support */}
          <div>
            <h3 className="font-semibold mb-4">RPH-WebUI</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Upload</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Packs</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 RPH-WebUI. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Discord className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}