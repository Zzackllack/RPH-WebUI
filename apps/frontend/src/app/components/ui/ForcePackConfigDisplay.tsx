"use client";

import { useToast } from "@/app/contexts/ToastContext";
import { motion } from "framer-motion";
import { Braces, Check, Copy, X } from "lucide-react";
import { useState } from "react";

interface ForcePackConfigDisplayProps {
    config: string;
    mode: "global" | "server";
    serverName?: string;
    onClose: () => void;
}

export function ForcePackConfigDisplay({
    config,
    mode,
    serverName,
    onClose,
}: ForcePackConfigDisplayProps) {
    const [copied, setCopied] = useState(false);
    const { addToast } = useToast();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(config);
            setCopied(true);
            addToast({
                type: "success",
                title: "Configuration Copied!",
                message: "ForcePack config has been copied to your clipboard.",
            });
        } catch (err) {
            addToast({
                type: "error",
                title: "Copy Failed",
                message: "Could not copy configuration. Please try again.",
            });
        }
        setTimeout(() => setCopied(false), 1200);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="minecraft-card p-6 md:p-8 space-y-6 border border-white/30 dark:border-gray-800/60 shadow-2xl backdrop-blur-lg bg-white/80 dark:bg-gray-900/80"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2 bg-gradient-to-r from-primary via-emerald-600 to-green-600 bg-clip-text drop-shadow-glow flex items-center gap-3">
                        <Braces className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        ForcePack Configuration
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {mode === "global"
                            ? "Global pack configuration"
                            : `Server configuration for "${serverName}"`}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Close configuration"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            <div className="relative flex-1">
                <pre className="bg-black/5 dark:bg-white/5 rounded-lg px-3 py-2 text-xs font-mono text-gray-800 dark:text-gray-100 select-all overflow-x shadow-inner border border-emerald-400/10 whitespace-pre-line break-words">
                    {config}
                </pre>
                <button
                    onClick={handleCopy}
                    className={`absolute top-3 right-3 p-2 rounded-lg transition-all ${
                        copied
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                    }`}
                    title={copied ? "Copied!" : "Copy configuration"}
                    aria-label={copied ? "Copied!" : "Copy configuration"}
                >
                    {copied ? (
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                        <Copy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                </button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    💡 <strong>Usage:</strong> Copy this configuration and paste
                    it into your ForcePack plugin&apos;s config file. Make sure
                    to restart your server after making changes to the
                    configuration.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                    <a
                        href="https://fortitude.islandearth.net/category/forcepack"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-blue-100 dark:bg-blue-800/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md hover:bg-blue-200 dark:hover:bg-blue-700/30 transition-colors"
                    >
                        📚 Documentation
                    </a>
                    <a
                        href="https://github.com/SamB440/ForcePack"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-gray-100 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/30 transition-colors"
                    >
                        🔗 GitHub
                    </a>
                </div>
            </div>
        </motion.div>
    );
}
