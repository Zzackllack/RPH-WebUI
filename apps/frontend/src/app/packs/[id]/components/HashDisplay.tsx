import { motion } from "framer-motion";
import { Check, Copy, Hash } from "lucide-react";
import { useState } from "react";

export default function HashDisplay({
    hash,
    loading,
}: {
    hash: string | null;
    loading: boolean;
}) {
    const [copied, setCopied] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-white/80 to-green-50/60 dark:from-gray-900/80 dark:to-green-900/40 border border-green-400/20 flex flex-col gap-2 shadow-md"
        >
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <Hash className="w-5 h-5 text-green-500" /> SHA-1 Hash
            </p>
            <div className="flex items-center gap-2 overflow-x-auto">
                {loading ? (
                    <span className="text-gray-600 dark:text-gray-400 animate-pulse">
                        Loading…
                    </span>
                ) : hash ? (
                    <>
                        <span className="break-all font-mono text-xs text-green-700 dark:text-green-300">
                            {hash}
                        </span>
                        <button
                            className={`ml-2 p-1 rounded transition relative overflow-hidden ${copied ? "bg-green-100 dark:bg-green-900/30" : "hover:bg-green-100 dark:hover:bg-green-900/30 cursor-pointer"}`}
                            onClick={() => {
                                navigator.clipboard.writeText(hash);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 1200);
                            }}
                            title={copied ? "Copied!" : "Copy Hash"}
                            aria-label={copied ? "Copied!" : "Copy Hash"}
                        >
                            <span
                                className={`transition-all duration-200 ${copied ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}
                            >
                                <Copy className="w-4 h-4 text-green-400" />
                            </span>
                            <span
                                className={`transition-all duration-200 absolute inset-0 flex items-center justify-center ${copied ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
                                style={{ pointerEvents: "none" }}
                            >
                                <Check className="w-4 h-4 text-green-500" />
                            </span>
                        </button>
                    </>
                ) : (
                    <span className="text-gray-600 dark:text-gray-400">
                        No hash available
                    </span>
                )}
            </div>
        </motion.div>
    );
}
