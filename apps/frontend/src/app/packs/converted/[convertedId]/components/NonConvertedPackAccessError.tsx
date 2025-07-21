import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function NonConvertedPackAccessError({
    errorCode,
}: {
    errorCode: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="minecraft-card p-10 max-w-lg w-full text-center"
            >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-12 h-12 text-red-500 dark:text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-3">
                    Access Forbidden
                </h2>
                <p className="text-base text-gray-800 dark:text-gray-200 mb-4">
                    This page is{" "}
                    <span className="font-bold text-yellow-600">
                        only for converted packs
                    </span>
                    .<br />
                    Accessing this page with a non-converted pack is{" "}
                    <span className="font-bold text-red-500">not allowed</span>.
                    <br />
                    Please use the original pack details page instead.
                </p>
                <div className="bg-emerald-50 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg px-4 py-2 mb-4 font-mono text-base border border-red-200 dark:border-red-900 inline-block">
                    Error Code: {errorCode}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    If you believe this is a mistake, contact support and
                    provide the error code above.
                </p>
            </motion.div>
        </div>
    );
}
