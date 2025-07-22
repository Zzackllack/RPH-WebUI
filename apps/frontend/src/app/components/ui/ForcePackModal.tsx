"use client";

import { useToast } from "@/app/contexts/ToastContext";
import type { ApiResourcePack } from "@/app/types";
import { AnimatePresence, motion } from "framer-motion";
import { Braces, ExternalLink, HelpCircle, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

interface ForcePackModalProps {
    open: boolean;
    onClose: () => void;
    pack: ApiResourcePack;
    conversions: ApiResourcePack[];
    apiUrl: string;
    onConfigGenerated: (config: string, mode: "global" | "server", serverName?: string) => void;
}

export function ForcePackModal({
    open,
    onClose,
    pack,
    conversions,
    apiUrl,
    onConfigGenerated,
}: ForcePackModalProps) {
    const [step, setStep] = useState<"intro" | "mode" | "server-name" | "review">("intro");
    const [mode, setMode] = useState<"global" | "server">("global");
    const [serverName, setServerName] = useState("");
    const { addToast } = useToast();

    const generateConfig = () => {
        const baseUrl = `${apiUrl}/uploads/${pack.storageFilename}`;
        const baseHash = pack.fileHash ?? "";
        let cfg = "";

        if (mode === "global") {
            cfg = `[global-pack]
    enable = true
    url = "${baseUrl}"
    hash = "${baseHash}"
    generate-hash = false
    resourcepack.prompt = "Please accept the resource pack to continue"
    exclude = []

    [global-pack.actions]
        [global-pack.actions.ACCEPTED]
            kick = false
            commands = []
        [global-pack.actions.DECLINED]
            kick = true
            message = "Resource pack is required to play on this server"
            commands = []
        [global-pack.actions.FAILED_DOWNLOAD]
            kick = true
            message = "Failed to download resource pack"
            commands = []
        [global-pack.actions.FAILED_RELOAD]
            kick = true
            message = "Failed to reload resource pack"
            commands = []
        [global-pack.actions.SUCCESSFUL]
            kick = false
            commands = []`;
        } else {
            cfg = `[servers]
    [servers.${serverName}]
        resourcepack.urls = ["${baseUrl}"]
        resourcepack.generate-hash = false
        resourcepack.hashes = ["${baseHash}"]
        resourcepack.prompt = "Please accept the resource pack to continue"
        [servers.${serverName}.actions]
            [servers.${serverName}.actions.ACCEPTED]
                kick = false
                commands = []
            [servers.${serverName}.actions.DECLINED]
                kick = true
                message = "Resource pack is required to play on this server"
                commands = []
            [servers.${serverName}.actions.FAILED_DOWNLOAD]
                kick = true
                message = "Failed to download resource pack"
                commands = []
            [servers.${serverName}.actions.FAILED_RELOAD]
                kick = true
                message = "Failed to reload resource pack"
                commands = []
            [servers.${serverName}.actions.SUCCESSFUL]
                kick = false
                commands = []`;

            // Add version-specific configs for converted packs
            conversions.forEach((c) => {
                const url = `${apiUrl}/uploads/${c.storageFilename}`;
                const hash = c.fileHash ?? "";
                cfg += `

[servers.${serverName}.version.${c.packFormat}]
    resourcepack.url = "${url}"
    resourcepack.generate-hash = false
    resourcepack.hash = "${hash}"
    resourcepack.prompt = "Please accept the resource pack to continue"`;
            });
        }

        return cfg.trim();
    };

    const handleGenerate = () => {
        const config = generateConfig();
        onConfigGenerated(config, mode, mode === "server" ? serverName : undefined);
        addToast({
            type: "success",
            title: "ForcePack Config Generated!",
            message: `${mode === "global" ? "Global" : "Server"} configuration has been created and is ready for use.`,
        });
        resetAndClose();
    };

    const resetAndClose = () => {
        setStep("intro");
        setMode("global");
        setServerName("");
        onClose();
    };

    const nextStep = () => {
        if (step === "intro") setStep("mode");
        else if (step === "mode") {
            if (mode === "server") setStep("server-name");
            else setStep("review");
        }
        else if (step === "server-name") setStep("review");
    };

    const prevStep = () => {
        if (step === "review") {
            if (mode === "server") setStep("server-name");
            else setStep("mode");
        }
        else if (step === "server-name") setStep("mode");
        else if (step === "mode") setStep("intro");
    };

    const canProceed = () => {
        if (step === "server-name") return serverName.trim().length > 0;
        return true;
    };

    if (!open) return null;

    return typeof window !== "undefined" ? createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                onClick={resetAndClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="relative w-full max-w-2xl p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={resetAndClose}
                        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                            <Braces className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                ForcePack Configuration Generator
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                <HelpCircle className="w-4 h-4" />
                                For server owners only •{" "}
                                <a
                                    href="https://fortitude.islandearth.net/category/forcepack"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-600 hover:text-emerald-700 underline flex items-center gap-1"
                                >
                                    Learn more
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center gap-2">
                            {["intro", "mode", "server-name", "review"].map((s, i) => {
                                const isActive = s === step;
                                const isCompleted = ["intro", "mode", "server-name", "review"].indexOf(step) > i;
                                const shouldShow = s !== "server-name" || mode === "server";
                                
                                if (!shouldShow) return null;
                                
                                return (
                                    <div key={s} className="flex items-center">
                                        <div
                                            className={`w-3 h-3 rounded-full transition-colors ${
                                                isActive
                                                    ? "bg-emerald-600"
                                                    : isCompleted
                                                    ? "bg-emerald-400"
                                                    : "bg-gray-300 dark:bg-gray-600"
                                            }`}
                                        />
                                        {i < 3 && shouldShow && (
                                            <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600 mx-1" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="min-h-[300px]">
                        {step === "intro" && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-center space-y-6"
                            >
                                <div className="text-6xl">🚀</div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                        Welcome to ForcePack Configuration!
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        ForcePack is a powerful plugin that automatically sends resource packs to players
                                        when they join your server. This wizard will help you generate the perfect
                                        configuration for your needs.
                                    </p>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                        💡 <strong>Tip:</strong> You'll need to have ForcePack installed on your server for this configuration to work.{" "}
                                        <a
                                            href="https://github.com/SamB440/ForcePack"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline hover:no-underline inline-flex items-center gap-1"
                                        >
                                            Visit GitHub
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {step === "mode" && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center">
                                    Choose Configuration Type
                                </h3>
                                <div className="grid gap-4">
                                    <label className={`cursor-pointer border-2 rounded-xl p-6 transition-all ${
                                        mode === "global"
                                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                    }`}>
                                        <input
                                            type="radio"
                                            name="mode"
                                            value="global"
                                            checked={mode === "global"}
                                            onChange={(e) => setMode(e.target.value as "global")}
                                            className="sr-only"
                                        />
                                        <div className="flex items-start gap-4">
                                            <div className="text-2xl">🌍</div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                    Global Pack
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Apply this resource pack to all players across all servers in your network.
                                                    Only supports the original pack format.
                                                </p>
                                            </div>
                                        </div>
                                    </label>
                                    
                                    <label className={`cursor-pointer border-2 rounded-xl p-6 transition-all ${
                                        mode === "server"
                                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                    }`}>
                                        <input
                                            type="radio"
                                            name="mode"
                                            value="server"
                                            checked={mode === "server"}
                                            onChange={(e) => setMode(e.target.value as "server")}
                                            className="sr-only"
                                        />
                                        <div className="flex items-start gap-4">
                                            <div className="text-2xl">🖥️</div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                    Server Pack
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Apply to a specific server with support for multiple converted versions.
                                                    Players with different Minecraft versions will get compatible packs.
                                                </p>
                                                {conversions.length > 0 && (
                                                    <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                                                        ✨ Supports all {conversions.length + 1} version{conversions.length > 0 ? "s" : ""}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </motion.div>
                        )}

                        {step === "server-name" && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                        Server Name
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Enter the name identifier for your server. This should match the server name in your network configuration.
                                    </p>
                                </div>
                                <div className="max-w-md mx-auto">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Server Name
                                    </label>
                                    <input
                                        type="text"
                                        value={serverName}
                                        onChange={(e) => setServerName(e.target.value)}
                                        placeholder="e.g., survival, creative, minigames"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                        autoFocus
                                    />
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        Use alphanumeric characters and underscores only. No spaces.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {step === "review" && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                        Review Configuration
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Here's a summary of your ForcePack configuration:
                                    </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Type:</span>
                                        <span className="text-gray-900 dark:text-gray-100 capitalize">
                                            {mode} Pack
                                        </span>
                                    </div>
                                    {mode === "server" && (
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Server:</span>
                                            <span className="text-gray-900 dark:text-gray-100 font-mono text-sm">
                                                {serverName}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Resource Pack:</span>
                                        <span className="text-gray-900 dark:text-gray-100 text-sm">
                                            {pack.originalFilename}
                                        </span>
                                    </div>
                                    {mode === "server" && conversions.length > 0 && (
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Versions:</span>
                                            <span className="text-gray-900 dark:text-gray-100 text-sm">
                                                {conversions.length + 1} supported
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                                    <p className="text-sm text-emerald-800 dark:text-emerald-200">
                                        🎉 Ready to generate! The configuration will be created and displayed for you to copy into your ForcePack config file.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={prevStep}
                            disabled={step === "intro"}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={resetAndClose}
                                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            {step === "review" ? (
                                <button
                                    onClick={handleGenerate}
                                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <Braces className="w-4 h-4" />
                                    Generate Config
                                </button>
                            ) : (
                                <button
                                    onClick={nextStep}
                                    disabled={!canProceed()}
                                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    ) : null;
}
