import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-purple-500/30">
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
