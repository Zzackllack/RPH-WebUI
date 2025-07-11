"use client";

import { motion } from "framer-motion";
import { CheckCircle, FileUp, Upload } from "lucide-react";
import type React from "react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Button from "./ui/Button";
import Card from "./ui/Card";

const UploadSection: React.FC = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setIsUploading(true);
    setUploadComplete(false);

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      setUploadProgress(progress);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    setIsUploading(false);
    setUploadComplete(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/zip": [".zip"],
      "application/x-zip-compressed": [".zip"],
    },
    maxFiles: 1,
  });

  const resetUpload = () => {
    setUploadProgress(0);
    setIsUploading(false);
    setUploadComplete(false);
    setUploadedFile(null);
  };

  return (
    <section id="upload-section" className="py-16 px-4 bg-minecraft-grass-dark">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Upload Your Resource Pack
          </h2>
          <p className="text-minecraft-grass-light text-lg">
            Drag and drop your .zip file or click to browse
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            {!uploadComplete ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors duration-200 ${
                  isDragActive
                    ? "border-minecraft-grass bg-minecraft-grass/10"
                    : "border-minecraft-stone-light hover:border-minecraft-grass"
                }`}
              >
                <input {...getInputProps()} />

                {isUploading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="text-minecraft-grass text-6xl">
                      <FileUp className="w-16 h-16 mx-auto animate-bounce" />
                    </div>
                    <h3 className="text-xl font-bold">Uploading...</h3>
                    <div className="w-full bg-minecraft-stone-dark rounded-full h-4 overflow-hidden">
                      <motion.div
                        className="bg-minecraft-grass h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <p className="text-sm text-gray-300">
                      {uploadProgress}% complete
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-minecraft-grass text-6xl">
                      <Upload className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-bold">
                      {isDragActive
                        ? "Drop your resource pack here!"
                        : "Upload Resource Pack"}
                    </h3>
                    <p className="text-gray-300">
                      {isDragActive
                        ? "Release to upload"
                        : "Drag & drop your .zip file here, or click to select"}
                    </p>
                    <p className="text-sm text-gray-400">
                      Supported formats: .zip (max 50MB)
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-6"
              >
                <div className="text-minecraft-grass text-6xl">
                  <CheckCircle className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-minecraft-grass">
                  Upload Complete!
                </h3>
                <div className="bg-minecraft-stone-dark p-4 rounded minecraft-border">
                  <p className="text-sm text-gray-300 mb-2">File uploaded:</p>
                  <p className="font-mono text-minecraft-grass">
                    {uploadedFile?.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Size:{" "}
                    {uploadedFile ? Math.round(uploadedFile.size / 1024) : 0} KB
                  </p>
                </div>
                <Button onClick={resetUpload} variant="secondary">
                  Upload Another Pack
                </Button>
              </motion.div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
