import { ConvertVersionModal } from "@/app/components/ui/ConvertVersionModal";
import type { ApiConversionJob, ApiResourcePack } from "@/app/types";
import { motion } from "framer-motion";
import { FolderSync } from "lucide-react";
import { useState } from "react";

type Props = {
    version: string;
    polling: boolean;
    startConversion: (v: string) => void;
    job: ApiConversionJob | null;
    convertedPack: ApiResourcePack | null;
    conversions: ApiResourcePack[];
    API: string;
};

export default function ConversionSection({
    startConversion,
    job,
    conversions,
}: Props) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <ConvertVersionModal
                open={showModal}
                onClose={() => setShowModal(false)}
                conversions={conversions}
                onConvert={(v) => {
                    startConversion(v);
                }}
            />
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className=""
            >
                <button
                    onClick={() => setShowModal(true)}
                    className="group relative minecraft-button w-full px-8 py-4 text-lg font-semibold flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                >
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <FolderSync className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span>Convert to Another Version</span>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </button>
                {job && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="minecraft-card p-6 mt-8 space-y-4 border border-emerald-400/20 bg-gradient-to-br from-white/80 to-emerald-50/60 dark:from-gray-900/80 dark:to-emerald-900/40 shadow-md"
                    >
                        <div className="flex items-center gap-2">
                            <strong>Job #{job.id}:</strong>
                            {job.status === "PENDING" ||
                            job.status === "IN_PROGRESS" ? (
                                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-300">
                                    <svg
                                        className="animate-spin w-4 h-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        />
                                    </svg>
                                    <span>{job.status.replace("_", " ")}</span>
                                </span>
                            ) : job.status === "FAILED" ? (
                                <span className="flex items-center gap-1 text-red-500">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        />
                                        <path
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8 12h8"
                                        />
                                    </svg>
                                    <span>Failed</span>
                                </span>
                            ) : job.status === "COMPLETED" ? (
                                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                    Completed
                                </span>
                            ) : null}
                        </div>
                        {job.status === "FAILED" && job.errorMessage && (
                            <p className="text-red-500 text-xs mt-1">
                                Error: {job.errorMessage}
                            </p>
                        )}
                        {job.consoleLog && (
                            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto mt-2">
                                {job.consoleLog}
                            </pre>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </>
    );
}
