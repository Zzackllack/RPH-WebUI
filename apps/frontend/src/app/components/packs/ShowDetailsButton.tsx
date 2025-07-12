"use client";

import { ApiResourcePack } from "@/app/types";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardCopy, Download, Hash, Info, X } from "lucide-react";
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

  const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${pack.storageFilename}`;

  const fetchHash = async () => {
    setLoading(true);
    setError(null);
    setHash(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/resourcepacks/${pack.id}/hash`,
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
    if (!hash) return;
    const snippet = `resource-pack=${downloadUrl}
resource-pack-sha1=${hash}`;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <>
      <button
        className="w-full py-3 px-4 bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 rounded-2xl text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 flex items-center justify-center space-x-2 border border-white/20 dark:border-gray-700/20"
        onClick={openModal}
        disabled={loading}
      >
        <Info className="w-4 h-4" />
        <span>Show Details</span>
      </button>
      {typeof window !== "undefined" &&
        createPortal(
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
                  className="relative w-full max-w-xl p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Info className="w-6 h-6 text-primary" />
                      Resource Pack Details
                    </h4>
                    <button
                      onClick={() => setModalOpen(false)}
                      className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Download URL */}
                    <div className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Download URL
                      </p>
                      <div className="flex items-start gap-2 overflow-x-auto">
                        <Download className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <a
                          href={downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {downloadUrl}
                        </a>
                      </div>
                    </div>

                    {/* File Hash */}
                    <div className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        SHA-256 Hash
                      </p>
                      <div className="flex items-start gap-2 overflow-x-auto">
                        <Hash className="w-5 h-5 text-green-500 flex-shrink-0" />
                        {loading ? (
                          <span className="text-gray-600 dark:text-gray-400">
                            Loading…
                          </span>
                        ) : error ? (
                          <span className="text-red-500">{error}</span>
                        ) : (
                          <span className="font-mono break-all text-gray-800 dark:text-gray-100">
                            {hash}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Server.properties Snippet */}
                    <div className="relative p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        server.properties Snippet
                      </p>
                      <pre className="font-mono text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap break-all">
                        {`resource-pack=${downloadUrl}
resource-pack-sha1=${hash ?? "<loading>"}`}
                      </pre>
                      <button
                        onClick={handleCopy}
                        disabled={!hash}
                        className="absolute top-4 right-4 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title={copied ? "Copied!" : "Copy to clipboard"}
                      >
                        <ClipboardCopy
                          className={`w-5 h-5 ${
                            copied
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
