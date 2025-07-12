"use client";

import { ApiResourcePack } from "@/app/types";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Hash, Info, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

interface ShowDetailsButtonProps {
  pack: ApiResourcePack;
}

export function ShowDetailsButton({ pack }: ShowDetailsButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Compose the download URL for the resource pack
  const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${pack.storageFilename}`;

  // Compose the server.properties snippet

  const fetchHash = async () => {
    setLoading(true);
    setError(null);
    setHash(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/resourcepacks/${pack.id}/hash?algo=sha1`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const txt = await res.text();
      setHash(txt.trim());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setModalOpen(true);
    fetchHash();
  };

  const handleCopy = () => {
    if (hash) {
      navigator.clipboard.writeText(
        `resource-pack=${downloadUrl}\nresource-pack-sha1=${hash}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <>
      <button
        className="w-full py-3 px-4 bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 rounded-2xl text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 flex items-center justify-center space-x-2 border border-white/20 dark:border-gray-700/20 cursor-pointer"
        onClick={openModal}
        disabled={loading}
      >
        <Info className="w-4 h-4" />
        <span>Show Details</span>
      </button>
      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="minecraft-card p-8 max-w-xl w-full mx-4 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Info className="w-6 h-6 text-primary" />
                    Resource Pack Details
                  </h4>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-base font-medium text-gray-800 dark:text-gray-200">
                    <Download className="w-5 h-5 text-blue-500" />
                    <a
                      href={downloadUrl}
                      className="underline break-all hover:text-blue-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {downloadUrl}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-base font-medium text-gray-800 dark:text-gray-200">
                    <Hash className="w-5 h-5 text-green-500" />
                    <span>
                      {loading
                        ? "Loading SHA-1..."
                        : hash
                        ? hash
                        : error
                        ? // Show error message in red color
                          <span className="text-red-500">{error}</span>
                        : ""}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Minecraft server.properties snippet:
                    </label>
                    <div className="relative">
                      <pre className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 text-xs font-mono text-gray-800 dark:text-gray-100 whitespace-pre-wrap break-all select-all">
{`resource-pack=${downloadUrl}
resource-pack-sha1=${hash || "<loading>"}`}
                      </pre>
                      <button
                        onClick={handleCopy}
                        disabled={!hash}
                        className="absolute top-2 right-2 px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
