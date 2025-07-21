import { motion } from "framer-motion";
import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";

export default function DownloadUrl({ url }: { url: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-white/80 to-emerald-50/60 dark:from-gray-900/80 dark:to-emerald-900/40 border border-green-400/20 flex flex-col gap-2 shadow-md"
        >
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-500" /> Download URL
            </p>
            <div className="flex items-center gap-2 overflow-x-auto">
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-blue-600 dark:text-blue-400 hover:underline font-mono text-xs"
                >
                    {url}
                </a>
                <button
                    className={`ml-2 p-1 rounded transition relative overflow-hidden ${copied ? "bg-green-100 dark:bg-green-900/30" : "hover:bg-blue-100 dark:hover:bg-blue-900/30"}`}
                    onClick={() => {
                        navigator.clipboard.writeText(url);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1200);
                    }}
                    title={copied ? "Copied!" : "Copy URL"}
                    aria-label={copied ? "Copied!" : "Copy URL"}
                >
                    <span
                        className={`transition-all duration-200 ${copied ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}
                    >
                        <Copy className="w-4 h-4 text-blue-400" />
                    </span>
                    <span
                        className={`transition-all duration-200 absolute inset-0 flex items-center justify-center ${copied ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
                        style={{ pointerEvents: "none" }}
                    >
                        <Check className="w-4 h-4 text-green-500" />
                    </span>
                </button>
            </div>
        </motion.div>
    );
}
