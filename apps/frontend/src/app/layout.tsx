import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/app/contexts/AuthContext';
import { ToastProvider } from '@/app/contexts/ToastContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CraftPacks - Minecraft Resource Pack Hub',
  description: 'Upload, share, and discover amazing Minecraft resource packs',
  keywords: ['minecraft', 'resource packs', 'textures', 'mods', 'gaming'],
  authors: [{ name: 'CraftPacks Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}