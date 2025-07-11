'use client';

import { useToast } from '@/app/contexts/ToastContext';
import type { UploadProgress } from '@/app/types';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, File, Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadFile {
  file: File;
  progress: UploadProgress;
  status: 'uploading' | 'success' | 'error';
  id: string;
}

export function UploadSection() {
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { addToast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newUploads = acceptedFiles.map(file => ({
      file,
      progress: { loaded: 0, total: file.size, percentage: 0 },
      status: 'uploading' as const,
      id: Math.random().toString(36).substr(2, 9),
    }));

    setUploads(prev => [...prev, ...newUploads]);
    setIsExpanded(true);

    // Simulate upload progress
    newUploads.forEach(upload => {
      simulateUpload(upload.id);
    });
  }, []);

  const simulateUpload = (id: string) => {
    const interval = setInterval(() => {
      setUploads(prev => prev.map(upload => {
        if (upload.id === id) {
          const newProgress = Math.min(upload.progress.percentage + Math.random() * 20, 100);
          const loaded = Math.floor((newProgress / 100) * upload.file.size);
          
          if (newProgress >= 100) {
            clearInterval(interval);
            addToast({
              type: 'success',
              title: 'Upload Complete',
              message: `${upload.file.name} has been uploaded successfully.`,
            });
            return {
              ...upload,
              progress: { loaded: upload.file.size, total: upload.file.size, percentage: 100 },
              status: 'success' as const,
            };
          }
          
          return {
            ...upload,
            progress: { loaded, total: upload.file.size, percentage: newProgress },
          };
        }
        return upload;
      }));
    }, 500);
  };

  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== id));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="minecraft-card p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Upload Resource Pack</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-green-600 hover:text-green-700 font-medium"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
                ${isDragActive 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-green-400 hover:bg-green-50/50'
                }
              `}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isDragActive ? 'Drop your files here' : 'Drag & drop your resource pack'}
              </h3>
              <p className="text-gray-600 mb-4">
                or click to browse your files
              </p>
              <p className="text-sm text-gray-500">
                Supports ZIP files up to 100MB
              </p>
            </div>

            {uploads.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="font-medium text-gray-900">Uploads</h4>
                {uploads.map((upload) => (
                  <motion.div
                    key={upload.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <File className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {upload.file.name}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatFileSize(upload.file.size)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${upload.progress.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {upload.status === 'success' && (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                      {upload.status === 'error' && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      <button
                        onClick={() => removeUpload(upload.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}