"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
    AlertCircle,
    CheckCircle,
    FileText,
    Upload,
    XCircle,
} from "lucide-react";
import { useCallback, useState } from "react";

interface UploadFile {
    file: File;
    progress: number;
    status: "pending" | "uploading" | "success" | "error";
    id: string;
    error?: string;
}

export function UploadSection() {
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        const zipFiles = droppedFiles.filter(
            (file) =>
                file.name.toLowerCase().endsWith(".zip") ||
                file.type === "application/zip"
        );

        const newFiles: UploadFile[] = zipFiles.map((file) => ({
            file,
            progress: 0,
            status: "pending",
            id: generateId(),
        }));

        setFiles((prev) => [...prev, ...newFiles]);

        // Start upload for each file
        newFiles.forEach((uploadFile) => {
            uploadSingleFile(uploadFile);
        });
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        const zipFiles = selectedFiles.filter(
            (file) =>
                file.name.toLowerCase().endsWith(".zip") ||
                file.type === "application/zip"
        );

        const newFiles: UploadFile[] = zipFiles.map((file) => ({
            file,
            progress: 0,
            status: "pending",
            id: generateId(),
        }));

        setFiles((prev) => [...prev, ...newFiles]);

        // Start upload for each file
        newFiles.forEach((uploadFile) => {
            uploadSingleFile(uploadFile);
        });

        // Reset input
        e.target.value = "";
    };

    const uploadSingleFile = async (uploadFile: UploadFile) => {
        setFiles((prev) =>
            prev.map((f) =>
                f.id === uploadFile.id
                    ? { ...f, status: "uploading" as const }
                    : f
            )
        );

        try {
            const formData = new FormData();
            formData.append("file", uploadFile.file);

            const xhr = new XMLHttpRequest();

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round(
                        (event.loaded / event.total) * 100
                    );
                    setFiles((prev) =>
                        prev.map((f) =>
                            f.id === uploadFile.id ? { ...f, progress } : f
                        )
                    );
                }
            };

            xhr.onload = () => {
                if (xhr.status === 201) {
                    setFiles((prev) =>
                        prev.map((f) =>
                            f.id === uploadFile.id
                                ? {
                                      ...f,
                                      status: "success" as const,
                                      progress: 100,
                                  }
                                : f
                        )
                    );
                } else {
                    setFiles((prev) =>
                        prev.map((f) =>
                            f.id === uploadFile.id
                                ? {
                                      ...f,
                                      status: "error" as const,
                                      error: `Upload failed with status ${xhr.status}`,
                                  }
                                : f
                        )
                    );
                }
            };

            xhr.onerror = () => {
                setFiles((prev) =>
                    prev.map((f) =>
                        f.id === uploadFile.id
                            ? {
                                  ...f,
                                  status: "error" as const,
                                  error: "Network error occurred",
                              }
                            : f
                    )
                );
            };

            xhr.open(
                "POST",
                `${process.env.NEXT_PUBLIC_API_URL}/api/resourcepacks`
            );
            xhr.send(formData);
        } catch (error) {
            setFiles((prev) =>
                prev.map((f) =>
                    f.id === uploadFile.id
                        ? {
                              ...f,
                              status: "error" as const,
                              error:
                                  error instanceof Error
                                      ? error.message
                                      : "Unknown error",
                          }
                        : f
                )
            );
        }
    };

    const removeFile = (id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    const clearCompleted = () => {
        setFiles((prev) =>
            prev.filter(
                (f) => f.status === "uploading" || f.status === "pending"
            )
        );
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mx-auto mb-12"
        >
            {/* Upload Area */}
            <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                className={`minecraft-card p-8 border-2 border-dashed transition-all duration-300 ${
                    isDragOver
                        ? "border-primary bg-primary/5 scale-[1.02]"
                        : "border-gray-300 dark:border-gray-600"
                }`}
            >
                <div className="text-center">
                    <motion.div
                        animate={{
                            scale: isDragOver ? 1.1 : 1,
                            rotate: isDragOver ? 5 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                        className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/25"
                    >
                        <Upload className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Upload Resource Packs
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Drag and drop your ZIP files here, or click to browse
                    </p>

                    <motion.label
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="minecraft-button px-8 py-3 text-base font-semibold cursor-pointer inline-flex items-center space-x-2"
                    >
                        <FileText className="w-5 h-5" />
                        <span>Choose Files</span>
                        <input
                            type="file"
                            multiple
                            accept=".zip,application/zip"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </motion.label>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                        Only ZIP files are accepted • Maximum 100MB per file
                    </p>
                </div>
            </div>

            {/* File List */}
            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6"
                    >
                        <div className="minecraft-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Upload Progress ({files.length} files)
                                </h4>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={clearCompleted}
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors"
                                >
                                    Clear Completed
                                </motion.button>
                            </div>

                            <div className="space-y-3">
                                <AnimatePresence>
                                    {files.map((file) => (
                                        <motion.div
                                            key={file.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 border border-white/20 dark:border-gray-700/20"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                    <div
                                                        className={`p-2 rounded-xl ${
                                                            file.status ===
                                                            "success"
                                                                ? "bg-green-100 dark:bg-green-900/20"
                                                                : file.status ===
                                                                    "error"
                                                                  ? "bg-red-100 dark:bg-red-900/20"
                                                                  : file.status ===
                                                                      "uploading"
                                                                    ? "bg-blue-100 dark:bg-blue-900/20"
                                                                    : "bg-gray-100 dark:bg-gray-800"
                                                        }`}
                                                    >
                                                        {file.status ===
                                                            "success" && (
                                                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                        )}
                                                        {file.status ===
                                                            "error" && (
                                                            <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                        )}
                                                        {file.status ===
                                                            "uploading" && (
                                                            <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                        )}
                                                        {file.status ===
                                                            "pending" && (
                                                            <AlertCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                            {file.file.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {formatFileSize(
                                                                file.file.size
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-3">
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        {file.progress}%
                                                    </span>
                                                    <motion.button
                                                        whileHover={{
                                                            scale: 1.1,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.9,
                                                        }}
                                                        onClick={() =>
                                                            removeFile(file.id)
                                                        }
                                                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        <XCircle className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                                    </motion.button>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                        width: `${file.progress}%`,
                                                    }}
                                                    transition={{
                                                        duration: 0.3,
                                                        ease: "easeOut",
                                                    }}
                                                    className={`h-full rounded-full transition-colors ${
                                                        file.status ===
                                                        "success"
                                                            ? "bg-green-500"
                                                            : file.status ===
                                                                "error"
                                                              ? "bg-red-500"
                                                              : "bg-gradient-to-r from-primary to-emerald-500"
                                                    }`}
                                                />
                                            </div>

                                            {/* Error Message */}
                                            {file.error && (
                                                <motion.p
                                                    initial={{
                                                        opacity: 0,
                                                        height: 0,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        height: "auto",
                                                    }}
                                                    className="text-sm text-red-600 dark:text-red-400 mt-2"
                                                >
                                                    {file.error}
                                                </motion.p>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
