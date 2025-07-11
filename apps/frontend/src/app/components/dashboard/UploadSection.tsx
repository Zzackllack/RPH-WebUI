'use client';

import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

// Minimal glassy upload dropzone
function GlassDropzone({ onDrop }: { onDrop: (files: File[]) => void }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
  });
  return (
    <div
      {...getRootProps()}
      className={`glass-effect border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 shadow-xl backdrop-blur-md ${
        isDragActive ? 'border-green-500 bg-green-100/60' : 'border-gray-300 hover:border-green-400 hover:bg-green-50/40'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="w-14 h-14 text-green-400 mx-auto mb-4 animate-bounce" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {isDragActive ? 'Drop your .zip file here' : 'Drag & drop your resource pack'}
      </h3>
      <p className="text-gray-600 mb-2">or click to browse your files</p>
      <p className="text-xs text-gray-500">ZIP files up to 100MB</p>
    </div>
  );
}

export function UploadSection() {
  const [uploaded, setUploaded] = useState<File[]>([]);
  const onDrop = useCallback((files: File[]) => {
    setUploaded(prev => [...prev, ...files]);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto mb-8"
    >
      <GlassDropzone onDrop={onDrop} />
      {uploaded.length > 0 && (
        <div className="mt-6 glass-effect rounded-xl p-6 shadow-lg animate-fade-in">
          <h4 className="font-semibold text-gray-900 mb-2">Uploaded Packs</h4>
          <ul className="divide-y divide-gray-200">
            {uploaded.map((file, idx) => (
              <li key={idx} className="py-2 flex items-center justify-between">
                <span className="truncate text-gray-800">{file.name}</span>
                <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.section>
  );
}
