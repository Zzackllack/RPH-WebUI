"use client";

import { ApiResourcePack } from '@/app/types';
import { Alert, Spin } from 'antd';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function PacksList() {
  const [packs, setPacks] = useState<ApiResourcePack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resourcepacks`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ApiResourcePack[]>;
      })
      .then(data => {
        setPacks(data);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin tip="Loading packs…" />;
  if (error) return <Alert type="error" message="Error loading packs" description={error} showIcon />;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
    >
      {packs.map(pack => (
        <PackCard key={pack.id} pack={pack} />
      ))}
    </motion.section>
  );
}

function PackCard({ pack }: { pack: ApiResourcePack }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="glass-effect rounded-xl p-4 shadow-lg flex flex-col items-center text-center transition-all duration-300"
    >
      {/* File name */}
      <h3 className="font-semibold text-gray-900 mb-2">
        {pack.originalFilename}
      </h3>

      {/* Size */}
      <p className="text-gray-600 text-sm mb-1">
        {(pack.size / 1024 / 1024).toFixed(2)} MB
      </p>

      {/* Upload date */}
      <p className="text-gray-500 text-xs mb-4">
        Uploaded {format(new Date(pack.uploadDate), 'MMM d, yyyy, HH:mm')}
      </p>

      {/* Download link */}
      <a
        href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${pack.storageFilename}`}
        className="text-green-600 hover:underline text-sm"
      >
        Download ZIP
      </a>
    </motion.div>
  );
}
