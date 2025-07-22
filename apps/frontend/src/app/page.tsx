"use client";

import { LoginPage } from "@/app/components/auth/LoginPage";
import { UploadSection } from "@/app/components/dashboard/UploadSection";
import PacksList from "@/app/components/packs/PacksList";
import { useAuth } from "@/app/contexts/AuthContext";
import { motion } from "framer-motion";

export default function Home() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center w-full text-center"
                >
                    <div className="relative mb-8 flex items-center justify-center w-full">
                        <div className="loading-spinner w-16 h-16"></div>
                    </div>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-300 text-lg font-medium"
                    >
                        Loading your Minecraft experience...
                    </motion.p>
                </motion.div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900 relative overflow-hidden pt-24 pb-24">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 minecraft-grid opacity-30"></div>

                {/* Floating particles */}
                <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-primary/20 rounded-full animate-bounce-subtle"></div>
                <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-emerald-500/20 rounded-full animate-bounce-subtle delay-300"></div>
                <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-green-400/20 rounded-full animate-bounce-subtle delay-700"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 pt-8 pb-16 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-emerald-600 to-green-600 bg-clip-text text-transparent text-glow"
                    >
                        Resource Pack Hub
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
                    >
                        Upload, manage, and share your Minecraft resource packs
                        with ease. Transform your Minecraft world with stunning
                        textures and designs.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                >
                    <UploadSection />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    <PacksList />
                </motion.div>
            </div>

            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/10 to-transparent dark:from-gray-900/10 pointer-events-none"></div>
        </main>
    );
}
