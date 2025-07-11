'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { motion } from 'framer-motion';

export function HeroSection() {
  useAuth();


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
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </section>
  );
}