import HeroSection from "@/components/HeroSection";
import LoginForm from "@/components/LoginForm";
import PacksList from "@/components/PacksList";
import UploadSection from "@/components/UploadSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <LoginForm />
      <UploadSection />
      <PacksList />
    </main>
  );
}
