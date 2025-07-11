"use client";

import { ApiResourcePack } from '@/app/types';
import { motion } from 'framer-motion';
import { FileArchive, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PackCard } from './PackCard';

function PacksList() {
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
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id: number) => {
    setPacks(prev => prev.filter(p => p.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="relative">
          <div className="loading-spinner w-12 h-12"></div>
          <div className="absolute inset-0 loading-spinner w-12 h-12 opacity-30 animate-ping"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="minecraft-card p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Failed to Load Packs
          </h3>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </motion.div>
    );
  }

  if (packs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="minecraft-card p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileArchive className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Resource Packs Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Upload your first resource pack to get started!
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto"
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent"
      >
        Resource Packs Collection
      </motion.h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {packs.map((pack, index) => (
          <motion.div
            key={pack.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PackCard pack={pack} onDelete={handleDelete} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export default PacksList;
