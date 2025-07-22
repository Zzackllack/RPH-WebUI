"use client";

import { Braces, HelpCircle } from "lucide-react";
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
}) => (
    <div className="flex justify-center mb-8">
        <button
            onClick={onClick}
            disabled={disabled}
            className={`group relative minecraft-button px-8 py-4 text-lg font-semibold flex items-center gap-3 transition-all duration-300 ${
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
                    For server owners only
                </span>
            </div>
            {!forcePackConfig && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            )}
        </button>
    </div>
);
