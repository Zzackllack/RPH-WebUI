'use client';

import { LoginPage } from '@/app/components/auth/LoginPage';
import { UploadSection } from '@/app/components/dashboard/UploadSection';
import { PacksList } from '@/app/components/packs/PacksList';
import { useAuth } from '@/app/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100">
      <UploadSection />
      <PacksList />
    </main>
  );
}