"use client";

import type { ApiResourcePack } from "@/app/types";
import { motion } from "framer-motion";
import { Info, SquareStack } from "lucide-react";
import Link from "next/link";
import { ZipLogo } from "@/app/components/ui/ZipLogo";

export default function ConvertedPacksSection({
    packs,
}: {
    packs: ApiResourcePack[];
}) {
    if (!packs.length) return null;
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg mx-auto"
        >
            <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-primary/70 to-emerald-400 bg-clip-text text-transparent"
            >
                Converted Versions
            </motion.h2>
            <div className="grid grid-cols-1 gap-6">
                {packs.map((pack) => (
                    <motion.div
                        key={pack.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="minecraft-card p-6 h-full flex flex-col relative group border-emerald-400/30"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 min-w-0">
                                <h3
                                    className="font-semibold text-gray-900 dark:text-gray-100 text-lg truncate mb-1"
                                    title={pack.originalFilename}
                                >
                                    {pack.originalFilename}
                                </h3>
                                <span className="inline-block text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 rounded px-2 py-0.5 mt-1">
                                    This is a converted pack
                                </span>
                            </div>
                            <div className="relative ml-3">
                                <ZipLogo className="w-10 h-10 drop-shadow-lg" />
                                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                            </div>
                        </div>
                        <div className="space-y-3 mb-6 flex-1">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <SquareStack className="w-4 h-4 mr-2 text-purple-500" />
                                <span>
                                    {pack.targetVersion ?? "Unknown version"}
                                </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <span>
                                    Pack Format: {pack.packFormat ?? "-"}
                                </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <span>
                                    Size: {(pack.size / 1024 / 1024).toFixed(2)}{" "}
                                    MB
                                </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <span>
                                    Uploaded:{" "}
                                    {new Date(
                                        pack.uploadDate
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <Link href={`/packs/converted/${pack.id}`}>
                            <button className="w-full py-3 px-4 bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 rounded-2xl text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center justify-center space-x-2 border border-white/20 dark:border-gray-700/20 transition-all duration-200 cursor-pointer">
                                <Info className="w-4 h-4" />
                                <span>View Details</span>
                            </button>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
