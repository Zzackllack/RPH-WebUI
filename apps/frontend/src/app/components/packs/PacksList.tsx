"use client";

import { ApiResourcePack } from '@/app/types';
import { Alert, Button, Modal, Spin, Tooltip } from 'antd';
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
      .then(data => setPacks(data))
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
  const [hash, setHash] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hashLoading, setHashLoading] = useState(false);
  const [hashError, setHashError] = useState<string | null>(null);

  const showHash = () => {
    setHashLoading(true);
    setHashError(null);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resourcepacks/${pack.id}/hash`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then(txt => {
        setHash(txt);
        setModalOpen(true);
      })
      .catch(err => {
        setHashError(err.message);
        setModalOpen(true);
      })
      .finally(() => setHashLoading(false));
  };

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="glass-effect rounded-xl p-5 shadow-lg flex flex-col items-center text-center transition-all duration-300 bg-white/70 dark:bg-gray-900/70"
    >
      {/* File name */}
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-lg truncate w-full" title={pack.originalFilename}>
        {pack.originalFilename}
      </h3>

      {/* Size */}
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
        {(pack.size / 1024 / 1024).toFixed(2)} MB
      </p>

      {/* Upload date */}
      <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">
        Uploaded {format(new Date(pack.uploadDate), 'MMM d, yyyy, HH:mm')}
      </p>

      {/* Download link */}
      <a
        href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${pack.storageFilename}`}
        className="text-green-600 dark:text-green-400 hover:underline text-sm font-medium mb-2"
        download
      >
        Download ZIP
      </a>

      {/* Show Hash Button */}
      <Tooltip title="Show the SHA-256 hash for this resource pack">
        <Button
          size="small"
          type="primary"
          className="mt-2"
          loading={hashLoading}
          onClick={showHash}
        >
          Show Hash
        </Button>
      </Tooltip>

      {/* Hash Modal */}
      <Modal
        title="Resource Pack SHA-256 Hash"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        centered
      >
        {hashLoading && <Spin tip="Loading hash..." />}
        {hashError && (
          <Alert type="error" message="Error fetching hash" description={hashError} showIcon />
        )}
        {hash && (
          <p className="break-all font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">
            {hash}
          </p>
        )}
      </Modal>
    </motion.div>
  );
}
