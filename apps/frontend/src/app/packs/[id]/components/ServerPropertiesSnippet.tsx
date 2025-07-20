import { motion } from "framer-motion";
import { Braces, Check, Copy } from "lucide-react";
import { useState } from "react";

export default function ServerPropertiesSnippet({ url, hash }: { url: string, hash: string | null }) {
  const [copied, setCopied] = useState(false);
  const snippet = `resource-pack=${url}\nresource-pack-sha1=${hash || ""}`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="relative p-4 rounded-2xl bg-gradient-to-br from-white/80 to-emerald-100/60 dark:from-gray-900/80 dark:to-emerald-900/40 border border-emerald-400/20 shadow-md"
    >
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
        <Braces className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> server.properties snippet
      </p>
      <div className="flex items-center gap-2">
        <pre className="bg-black/5 dark:bg-white/5 rounded-lg px-3 py-2 text-xs font-mono text-gray-800 dark:text-gray-100 select-all overflow-x shadow-inner border border-emerald-400/10 whitespace-pre-line break-words">
          {snippet}
        </pre>
        <button
          className={`ml-2 p-1 rounded transition relative overflow-hidden ${copied ? "bg-green-100 dark:bg-green-900/30" : "hover:bg-emerald-100 dark:hover:bg-emerald-900/30"}`}
          onClick={() => {
            navigator.clipboard.writeText(snippet);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
          title={copied ? "Copied!" : "Copy snippet"}
          aria-label={copied ? "Copied!" : "Copy snippet"}
        >
          <span className={`transition-all duration-200 ${copied ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}>
            <Copy className="w-4 h-4 text-emerald-400" />
          </span>
          <span className={`transition-all duration-200 absolute inset-0 flex items-center justify-center ${copied ? "opacity-100 scale-100" : "opacity-0 scale-75"}`} style={{ pointerEvents: "none" }}>
            <Check className="w-4 h-4 text-green-500" />
          </span>
        </button>
      </div>
    </motion.div>
  );
}
