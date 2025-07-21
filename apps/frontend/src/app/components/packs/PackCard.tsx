"use client";

import { ApiResourcePack } from "@/app/types";
import { motion } from "framer-motion";
import {
    Calendar,
    Download,
    HardDrive,
    Info,
    SquareStack,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ZipLogo } from "../ui/ZipLogo";

interface PackCardProps {
    pack: ApiResourcePack;
    onDelete: (id: number) => void;
}

export function PackCard({ pack, onDelete }: PackCardProps) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (
            !window.confirm(
                "Are you sure you want to delete this resource pack? This action cannot be undone."
            )
        )
            return;
        setDeleting(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/resourcepacks/${pack.id}`,
                { method: "DELETE" }
            );
            if (!res.ok && res.status !== 204)
                throw new Error(`Failed to delete (HTTP ${res.status})`);
            onDelete(pack.id);
        } catch (err) {
            alert("Failed to delete resource pack.");
        } finally {
            setDeleting(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${pack.storageFilename}`;

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
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                </div>
            </div>

            {/* Stats */}
            <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <HardDrive className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="font-medium">
                        {formatFileSize(pack.size)}
                    </span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2 text-green-500" />
                    <span>
                        {pack.uploadDate
                            ? formatDate(pack.uploadDate)
                            : "Unknown date"}
                    </span>
                </div>
                {pack.minecraftVersion && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <SquareStack className="w-4 h-4 mr-2 text-purple-500" />
                        <span>{pack.minecraftVersion}</span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
                <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={downloadUrl}
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
                        className="w-full py-3 px-4 bg-red-600/90 hover:bg-red-700 text-white rounded-2xl text-sm font-medium flex items-center justify-center space-x-2 border border-red-700/40 transition-all duration-200 shadow-md shadow-red-500/10 z-10 relative group/delete-btn cursor-pointer"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>{deleting ? "Deleting..." : "Delete"}</span>
                    </motion.button>
                    <div className="pointer-events-none absolute -inset-1 bg-gradient-to-r from-red-500 to-red-700 rounded-2xl blur opacity-0 group-hover/delete-btn:opacity-40 transition-opacity z-0" />
                </div>

                {/* Navigate to Details Page */}
                <Link href={`/packs/${pack.id}`}>
                    <button className="w-full py-3 px-4 bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 rounded-2xl text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center justify-center space-x-2 border border-white/20 dark:border-gray-700/20 transition-all duration-200 cursor-pointer">
                        <Info className="w-4 h-4" />
                        <span>Details</span>
                    </button>
                </Link>
            </div>
        </motion.div>
    );
}
