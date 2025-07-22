"use client";

import { motion } from "framer-motion";
import { Braces } from "lucide-react";
import React from "react";

interface GenerateForcePackConfigButtonProps {
    disabled: boolean;
    onClick: () => void;
    forcePackConfig: any;
}

export const GenerateForcePackConfigButton: React.FC<GenerateForcePackConfigButtonProps> = ({
    disabled,
    onClick,
    forcePackConfig,
}) => {
    const { addToast } = require("@/app/contexts/ToastContext");

    const handleClick = () => {
        if (disabled) {
            addToast({
                type: "warning",
                title: "Action Disabled",
                message: "You cannot generate a config right now.",
            });
            return;
        }
        if (forcePackConfig) {
            addToast({
                type: "info",
                title: "Config Already Generated",
                message: "A ForcePack config has already been generated.",
            });
            return;
        }
        onClick();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className=""
        >
            <button
                onClick={handleClick}
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
                </div>
                {!forcePackConfig && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                )}
            </button>
        </motion.div>
    );
};
