import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export function WarningModal({
    open,
    onClose,
    version,
}: {
    open: boolean;
    onClose: () => void;
    version: string;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="minecraft-card max-w-md w-full p-8 border-4 border-red-700 bg-gradient-to-br from-red-100 via-yellow-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900 shadow-2xl relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-700"
                    aria-label="Close warning"
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="flex flex-col items-center gap-4">
                    <AlertTriangle className="w-12 h-12 text-red-700 animate-pulse" />
                    <h2 className="text-2xl font-bold text-red-700 mb-2 drop-shadow-glow">
                        Warning!
                    </h2>
                    <p className="text-lg text-gray-800 dark:text-gray-200 font-semibold text-center">
                        A converted pack for{" "}
                        <span className="font-mono text-red-700">
                            Minecraft {version}
                        </span>{" "}
                        already exists.
                        <br />
                        <span className="text-red-600 font-bold">
                            Converting again may break things, overwrite files,
                            or cause chaos!
                        </span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                        If you proceed, the existing converted pack may be
                        replaced or corrupted.
                        <br />
                        <span className="font-bold text-yellow-700">
                            Are you absolutely sure you want to continue?
                        </span>
                    </p>
                    <button
                        onClick={onClose}
                        className="mt-4 px-6 py-2 rounded-2xl bg-red-700 text-white font-bold shadow-lg hover:bg-red-800 transition-all"
                    >
                        Got it, I understand
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
