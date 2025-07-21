"use client";

import { Footer } from "@/app/components/layout/Footer";
import { Header } from "@/app/components/layout/Header";
import { useAuth } from "@/app/contexts/AuthContext";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DashboardLayoutProps {
    children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.username}!
                    </h1>
                    <p className="text-gray-600">
                        Manage your resource packs and track your community
                        impact.
                    </p>
                </motion.div>

                {children}
            </main>

            <Footer />
        </div>
    );
}
