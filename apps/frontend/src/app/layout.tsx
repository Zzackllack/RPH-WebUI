import { Header } from "@/app/components/layout/Header";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { ThemeProvider } from "@/app/contexts/ThemeContext";
import { ToastProvider } from "@/app/contexts/ToastContext";
import { Footer } from "./components/layout/Footer";

import "antd/dist/reset.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "RPH-WebUI",
    description:
        "Host, share, and use your Minecraft ressource packs on your server",
    keywords: ["minecraft", "resource packs", "textures", "mods", "gaming"],
    authors: [{ name: "Zacklack", url: "https://zacklack.de" }],
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${inter.className} antialiased`}>
                <ThemeProvider>
                    <AuthProvider>
                        <ToastProvider>
                            <Header />
                            {children}
                            <Footer />
                        </ToastProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
