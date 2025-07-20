import type { ApiResourcePack } from "@/app/types";
import { motion } from "framer-motion";

export default function PackInfo({ pack }: { pack: ApiResourcePack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-gradient-to-br from-white/80 to-emerald-50/60 dark:from-gray-900/80 dark:to-emerald-900/40 border border-emerald-400/20 shadow-md"
    >
      <div>
        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Minecraft Version</span>
        <span className="font-mono text-sm text-emerald-700 dark:text-emerald-300">{pack.minecraftVersion || "Unknown"}</span>
      </div>
      <div>
        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Pack Format</span>
        <span className="font-mono text-sm text-green-700 dark:text-green-300">{pack.packFormat ?? "-"}</span>
      </div>
      <div>
        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Size</span>
        <span className="font-mono text-sm text-blue-700 dark:text-blue-300">{(pack.size / 1024 / 1024).toFixed(2)} MB</span>
      </div>
      <div>
        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Uploaded</span>
        <span className="font-mono text-sm text-gray-700 dark:text-gray-300">{new Date(pack.uploadDate).toLocaleString()}</span>
      </div>
    </motion.div>
  );
}
