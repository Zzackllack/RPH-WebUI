"use client";

import { ApiResourcePack } from '@/app/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Download, HardDrive, Hash, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { ZipLogo } from '../ui/ZipLogo';

interface PackCardProps {
  pack: ApiResourcePack;
  onDelete: (id: number) => void;
}

export function PackCard({ pack, onDelete }: PackCardProps) {
  const [hash, setHash] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hashLoading, setHashLoading] = useState(false);
  const [hashError, setHashError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this resource pack? This action cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resourcepacks/${pack.id}`, {
        method: 'DELETE',
      });
      if (!res.ok && res.status !== 204) throw new Error(`Failed to delete (HTTP ${res.status})`);
      onDelete(pack.id);
    } catch (err) {
      alert('Failed to delete resource pack.');
    } finally {
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="minecraft-card p-6 h-full flex flex-col relative group"
    >
      {/* Header with ZIP Logo */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 
            className="font-semibold text-gray-900 dark:text-gray-100 text-lg truncate mb-1"
            title={pack.originalFilename}
          >
            {pack.originalFilename}
          </h3>
        </div>
        <div className="relative ml-3">
          <ZipLogo className="w-10 h-10 drop-shadow-lg" />
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3 mb-6 flex-1">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <HardDrive className="w-4 h-4 mr-2 text-blue-500" />
          <span className="font-medium">{formatFileSize(pack.size)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4 mr-2 text-green-500" />
          <span>
            {pack.uploadDate ? formatDate(pack.uploadDate) : 'Unknown date'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${pack.storageFilename}`}
          className="w-full py-3 px-4 text-sm font-semibold flex items-center justify-center space-x-2 rounded-2xl minecraft-button"
          download
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </motion.a>

        <div className="relative w-full">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDelete}
            disabled={deleting}
            className="w-full py-3 px-4 bg-red-600/90 hover:bg-red-700 text-white rounded-2xl text-sm font-medium flex items-center justify-center space-x-2 border border-red-700/40 transition-all duration-200 shadow-md shadow-red-500/10 z-10 relative group/delete-btn"
          >
            <Trash2 className="w-4 h-4" />
            <span>{deleting ? 'Deleting...' : 'Delete'}</span>
          </motion.button>
          {/* Glow effect only on hover of the delete button */}
          <div className="pointer-events-none absolute -inset-1 bg-gradient-to-r from-red-500 to-red-700 rounded-2xl blur opacity-0 group-hover/delete-btn:opacity-40 transition-opacity z-0"></div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={showHash}
          className="w-full py-3 px-4 bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 rounded-2xl text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 flex items-center justify-center space-x-2 border border-white/20 dark:border-gray-700/20"
          disabled={hashLoading}
        >
          <Hash className="w-4 h-4" />
          <span>{hashLoading ? 'Loading...' : 'Show Hash'}</span>
        </motion.button>
      </div>

      {/* Hash Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="minecraft-card p-6 max-w-lg w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  <Hash className="w-5 h-5 mr-2 text-primary" />
                  SHA-256 Hash
                </h4>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>
              
              {hashError ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
                  <p className="text-red-600 dark:text-red-400 text-sm">{hashError}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Resource pack: <span className="font-medium">{pack.originalFilename}</span>
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
                    <code className="font-mono text-xs break-all text-gray-700 dark:text-gray-200 block">
                      {hash}
                    </code>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (hash) {
                        navigator.clipboard.writeText(hash);
                      }
                    }}
                    className="w-full py-2 px-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-sm font-medium transition-colors"
                  >
                    Copy to Clipboard
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
