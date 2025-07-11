'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Star, Upload, Users } from 'lucide-react';

export function HeroSection() {
  const { isAuthenticated } = useAuth();

  const stats = [
    { icon: Download, label: 'Downloads', value: '2.5M+' },
    { icon: Upload, label: 'Packs', value: '15K+' },
    { icon: Users, label: 'Creators', value: '8K+' },
    { icon: Star, label: 'Rating', value: '4.9' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 minecraft-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-50" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 bg-green-500/10 rounded-lg pixel-border"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Discover Amazing{' '}
            <span className="text-green-600 text-glow">Minecraft</span>{' '}
            Resource Packs
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload, share, and discover the best texture packs created by the community. 
            Transform your Minecraft experience with just a few clicks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="minecraft-button flex items-center gap-2 text-lg px-8 py-4 glow-effect"
            >
              <Upload className="w-5 h-5" />
              {isAuthenticated ? 'Upload Your Pack' : 'Get Started'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/80 backdrop-blur-md text-gray-900 font-medium py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-150 border border-gray-200/50 flex items-center gap-2"
            >
              Browse Packs
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="minecraft-card p-6 text-center hover:scale-105 transition-transform duration-300"
              >
                <stat.icon className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}