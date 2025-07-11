'use client';

import { motion } from "framer-motion";
import type React from "react";
import Button from "./ui/Button";

const HeroSection: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-minecraft-dirt-dark to-minecraft-dirt relative overflow-hidden">
      {/* Animated background blocks */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 bg-minecraft-grass"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="text-center z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            Resource Pack Hub
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-minecraft-grass-light max-w-2xl mx-auto">
            Upload, manage, and share your Minecraft resource packs with the
            community
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              variant="grass"
              size="lg"
              onClick={() =>
                document
                  .getElementById("upload-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Start Uploading
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating blocks animation */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white opacity-50"
          >
            Scroll down to explore
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
