'use client';

import { DashboardLayout } from '@/app/components/dashboard/DashboardLayout';
import { PacksManagement } from '@/app/components/dashboard/PacksManagement';
import { StatsCards } from '@/app/components/dashboard/StatsCards';
import { UploadSection } from '@/app/components/dashboard/UploadSection';
import { HeroSection } from '@/app/components/home/HeroSection';
import { RestrictedAccess } from '@/app/components/home/RestrictedAccess';
import { Footer } from '@/app/components/layout/Footer';
import { Header } from '@/app/components/layout/Header';
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

  if (isAuthenticated) {
    return (
      <DashboardLayout>
        <StatsCards />
        <UploadSection />
        <PacksManagement />
      </DashboardLayout>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <RestrictedAccess />
      <Footer />
    </div>
  );
}