import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ErrorCard({ error }: { error: string }) {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="minecraft-card p-8 max-w-md w-full text-center border border-red-200 dark:border-red-900/40 shadow-xl"
            >
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Failed to Load Pack
                </h3>
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <button
                    onClick={() => router.back()}
                    className="mt-6 minecraft-button px-6 py-2"
                >
                    Go Back
                </button>
            </motion.div>
        </div>
    );
}
