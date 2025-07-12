"use client";

import type { ApiResourcePack } from "@/app/types";
import { motion } from "framer-motion";
import { Download, Hash, X } from "lucide-react";
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
    return (
      <div className="flex items-center justify-center py-20">
        <div className="loading-spinner w-12 h-12" />
      </div>
    );
  }
  if (error || !pack) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">Error loading pack: {error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 minecraft-button px-6 py-2"
        >
          Go Back
        </button>
      </div>
    );
  }

  const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${pack.storageFilename}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto py-8 space-y-6"
    >
      <Link
        href="/"
        className="text-sm text-gray-500 hover:underline flex items-center gap-1"
      >
        <X className="w-4 h-4" /> Back to all packs
      </Link>

      <div className="minecraft-card p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {pack.originalFilename}
        </h1>

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

        {/* SHA-256 Hash */}
        <div className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            SHA-256 Hash
          </p>
          <div className="flex items-start gap-2 overflow-x-auto">
            <Hash className="w-5 h-5 text-green-500 flex-shrink-0" />
            {hashLoading ? (
              <span className="text-gray-600 dark:text-gray-400">Loading…</span>
            ) : (
              <span className="font-mono break-all text-gray-800 dark:text-gray-100">
                {hash}
              </span>
            )}
          </div>
        </div>

        {/* server.properties snippet */}
        <div className="relative p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            server.properties Snippet
          </p>
          <pre className="font-mono text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap break-all">
{`resource-pack=${downloadUrl}
resource-pack-sha1=${hash ?? "<loading>"}`}
          </pre>
        </div>
      </div>
    </motion.div>
  );
}
