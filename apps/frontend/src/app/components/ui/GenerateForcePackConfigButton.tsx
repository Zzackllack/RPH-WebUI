"use client";

import { Braces, HelpCircle } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

interface GenerateForcePackConfigButtonProps {
    disabled: boolean;
    onClick: () => void;
    forcePackConfig: any;
}

export const GenerateForcePackConfigButton: React.FC<GenerateForcePackConfigButtonProps> = ({
    disabled,
    onClick,
    forcePackConfig,
}) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className=""
    >
        <button
            onClick={onClick}
            disabled={disabled}
            className={`group relative minecraft-button w-full px-8 py-4 text-lg font-semibold flex items-center gap-3 transition-all duration-300 cursor-pointer ${
                forcePackConfig
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105 hover:shadow-xl"
            }`}
        >
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Braces className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex flex-col items-start">
                <span>Generate ForcePack Config</span>
                <span className="text-xs opacity-70 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" />
                    Will generate a configuration for this pack(s) for the ForcePack plugin.
                </span>
            </div>
            {!forcePackConfig && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            )}
        </button>
    </motion.div>
);
