import { Header } from "@/app/components/layout/Header";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { ThemeProvider } from "@/app/contexts/ThemeContext";
import { ToastProvider } from "@/app/contexts/ToastContext";
import { Footer } from "./components/layout/Footer";

// Importing the TwentyFirstToolbar component from the 21st extension - AI toolbar for frontend development
import { TwentyFirstToolbar } from "@21st-extension/toolbar-next";

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
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <head>
                <meta name="apple-mobile-web-app-title" content="RPH-WebUI" />
                {/* Open Graph tags for rich embeds */}
                <meta property="og:title" content="RPH-WebUI" />
                <meta
                    property="og:description"
                    content="Host, share, and use your Minecraft resource packs on your server"
                />
                <meta
                    property="og:image"
                    content="/web-app-manifest-512x512.png"
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://rph.zacklack.de" />
                <meta property="og:site_name" content="RPH-WebUI" />
                <meta property="og:locale" content="en_US" />
                {/* Twitter Card tags for broader compatibility */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="RPH-WebUI" />
                <meta
                    name="twitter:description"
                    content="Host, share, and use your Minecraft resource packs on your server"
                />
                <meta
                    name="twitter:image"
                    content="/web-app-manifest-512x512.png"
                />
                <meta name="twitter:site" content="@zacklack" />
                {/* Favicon for browser tabs */}
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="192x192"
                    href="/web-app-manifest-192x192.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="512x512"
                    href="/web-app-manifest-512x512.png"
                />
            </head>
            <body className={`${inter.className} antialiased`}>
                <TwentyFirstToolbar
                    config={{
                        plugins: [],
                    }}
                />
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
