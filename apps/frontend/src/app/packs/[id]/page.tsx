"use client";

import type { ApiResourcePack } from "@/app/types";
import { motion } from "framer-motion";
import { Braces, Check, Copy, Download, Hash, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PackDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [pack, setPack] = useState<ApiResourcePack | null>(null);
  const [hash, setHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hashLoading, setHashLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Copy button states
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resourcepacks/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<ApiResourcePack>;
      })
      .then(setPack)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setHashLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resourcepacks/${id}/hash`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((txt) => setHash(txt.trim()))
      .catch((e) => setError(e.message))
      .finally(() => setHashLoading(false));
  }, [id]);

  if (loading) {
    return ( // Updated loading state
      <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="relative mx-auto mb-8">
            <div className="loading-spinner w-16 h-16"></div>
            <div className="absolute inset-0 loading-spinner w-16 h-16 opacity-30 animate-ping"></div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-300 text-lg font-medium"
          >
            Loading pack details...
          </motion.p>
        </motion.div>
      </div>
    );
  }
  if (error || !pack) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="minecraft-card p-8 max-w-md w-full text-center border border-red-200 dark:border-red-900/40 shadow-xl"
        >
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Failed to Load Pack
          </h3>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-6 minecraft-button px-6 py-2"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${pack.storageFilename}`;

  return ( // Updated main return
    <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900 overflow-hidden">
      {/* Animated background glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute inset-0 minecraft-grid opacity-20"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl mx-auto px-4"
      >
        <Link
          href="/"
          className="text-sm text-gray-500 hover:underline flex items-center gap-1 mb-4"
        >
          <X className="w-4 h-4" /> Back to all packs
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="minecraft-card p-8 space-y-8 border border-white/30 dark:border-gray-800/60 shadow-2xl backdrop-blur-lg bg-white/80 dark:bg-gray-900/80"
        >
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2 bg-gradient-to-r from-primary via-emerald-600 to-green-600 bg-clip-text drop-shadow-glow"
          >
            {pack.originalFilename}
          </motion.h1>

            {/* Download URL */}
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
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-blue-600 dark:text-blue-400 hover:underline font-mono text-xs"
              >
              {downloadUrl}
              </a>
              <button
              className={`ml-2 p-1 rounded transition relative overflow-hidden ${copiedUrl ? 'bg-green-100 dark:bg-green-900/30' : 'hover:bg-blue-100 dark:hover:bg-blue-900/30'}`}
              onClick={() => {
                navigator.clipboard.writeText(downloadUrl);
                setCopiedUrl(true);
                setTimeout(() => setCopiedUrl(false), 1200);
              }}
              title={copiedUrl ? "Copied!" : "Copy URL"}
              aria-label={copiedUrl ? "Copied!" : "Copy URL"}
              >
              <span className={`transition-all duration-200 ${copiedUrl ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}>
                <Copy className="w-4 h-4 text-blue-400" />
              </span>
              <span
                className={`transition-all duration-200 absolute inset-0 flex items-center justify-center ${copiedUrl ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
                style={{ pointerEvents: 'none' }}
              >
                <Check className="w-4 h-4 text-green-500" />
              </span>
              </button>
            </div>
            </motion.div>

          {/* SHA-256 Hash */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-white/80 to-green-50/60 dark:from-gray-900/80 dark:to-green-900/40 border border-green-400/20 flex flex-col gap-2 shadow-md"
          >
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
              <Hash className="w-5 h-5 text-green-500" /> SHA-256 Hash
            </p>
            <div className="flex items-center gap-2 overflow-x-auto">
              {hashLoading ? (
                <span className="text-gray-600 dark:text-gray-400 animate-pulse">Loading…</span>
              ) : hash ? (
                <>
                  <span className="break-all font-mono text-xs text-green-700 dark:text-green-300">{hash}</span>
                  <button
                    className={`ml-2 p-1 rounded transition relative overflow-hidden ${copiedHash ? 'bg-green-100 dark:bg-green-900/30' : 'hover:bg-green-100 dark:hover:bg-green-900/30'}`}
                    onClick={() => {
                      if (hash) {
                        navigator.clipboard.writeText(hash);
                        setCopiedHash(true);
                        setTimeout(() => setCopiedHash(false), 1200);
                      }
                    }}
                    title={copiedHash ? "Copied!" : "Copy Hash"}
                    aria-label={copiedHash ? "Copied!" : "Copy Hash"}
                  >
                    <span className={`transition-all duration-200 ${copiedHash ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}>
                      <Copy className="w-4 h-4 text-green-400" />
                    </span>
                    <span className={`transition-all duration-200 absolute inset-0 flex items-center justify-center ${copiedHash ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
                      style={{ pointerEvents: 'none' }}>
                      <Check className="w-4 h-4 text-green-500" />
                    </span>
                  </button>
                </>
              ) : (
                <span className="text-gray-600 dark:text-gray-400">No hash available</span>
              )}
            </div>
          </motion.div>

          {/* server.properties snippet */}
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
{`resource-pack=${downloadUrl}
resource-pack-sha1=${hash || ''}`}
              </pre>
              <button
                className={`ml-2 p-1 rounded transition relative overflow-hidden ${copiedSnippet ? 'bg-green-100 dark:bg-green-900/30' : 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30'}`}
                onClick={() => {
                  navigator.clipboard.writeText(`resource-pack=${downloadUrl}\nresource-pack-sha1=${hash || ''}`);
                  setCopiedSnippet(true);
                  setTimeout(() => setCopiedSnippet(false), 1200);
                }}
                title={copiedSnippet ? "Copied!" : "Copy snippet"}
                aria-label={copiedSnippet ? "Copied!" : "Copy snippet"}
              >
                <span className={`transition-all duration-200 ${copiedSnippet ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}>
                  <Copy className="w-4 h-4 text-emerald-400" />
                </span>
                <span className={`transition-all duration-200 absolute inset-0 flex items-center justify-center ${copiedSnippet ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
                  style={{ pointerEvents: 'none' }}>
                  <Check className="w-4 h-4 text-green-500" />
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
