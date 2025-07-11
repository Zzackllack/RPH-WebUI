import { motion } from "framer-motion";
import React from "react";

export const MinecraftLogo: React.FC<{ className?: string }> = ({ className }) => (
    <motion.div
        whileHover={{ 
            scale: 1.1, 
            rotate: [0, -5, 5, 0],
            transition: { duration: 0.3 }
        }}
        className="relative inline-block"
    >
        <img
            src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/minecraft.svg"
            alt="Minecraft Logo"
            className={className || "w-8 h-8"}
            draggable={false}
            style={{ 
                filter: "drop-shadow(0 2px 4px rgba(59, 133, 38, 0.15))",
            }}
        />
        {/* Subtle animated glow ring */}
        <motion.div
            animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.08, 0.13, 0.08]
            }}
            transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-r from-primary to-emerald-500 rounded-lg blur-sm -z-10"
            style={{ 
                width: '110%',
                height: '110%',
                left: '-5%',
                top: '-5%',
                opacity: 0.08
            }}
        />
    </motion.div>
);
