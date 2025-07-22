import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center w-full text-center"
            >
                <div className="mb-8 flex items-center justify-center w-full">
                    <div className="loading-spinner w-16 h-16"></div>
                </div>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-600 dark:text-gray-300 text-lg font-medium"
                >
                    Loading pack details...
                </motion.p>
            </motion.div>
        </div>
    );
}
