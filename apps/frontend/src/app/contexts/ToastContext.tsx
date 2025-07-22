"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { createContext, ReactNode, useContext, useState } from "react";

interface Toast {
    id: string;
    type: "success" | "error" | "info" | "warning";
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextType {
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (toast: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { ...toast, id };

        setToasts((prev) => [...prev, newToast]);

        // Auto remove after duration
        setTimeout(() => {
            removeToast(id);
        }, toast.duration || 5000);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const getIcon = (type: Toast["type"]) => {
        switch (type) {
            case "success":
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "error":
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case "warning":
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case "info":
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };


    // Force dark mode for all toasts
    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 100, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.8 }}
                            className={`max-w-md p-4 rounded-2xl border-2 shadow-2xl backdrop-blur-lg bg-gray-900/95 border-gray-800 pointer-events-auto flex items-center gap-4 transition-all duration-300`}
                        >
                            <div className="flex items-center gap-3 w-full">
                                <div className="flex-shrink-0">{getIcon(toast.type)}</div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-100 drop-shadow-glow">
                                        {toast.title}
                                    </h4>
                                    {toast.message && (
                                        <p className="text-sm text-gray-400 mt-1">
                                            {toast.message}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="ml-2 p-2 rounded-lg bg-gray-800 hover:bg-emerald-700 text-gray-300 hover:text-white shadow-md transition-all"
                                    aria-label="Close toast"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
