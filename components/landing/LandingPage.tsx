import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";

export function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-950 font-sans text-white selection:bg-purple-500/30">
            <Hero />
            <Features />
            <Footer />
        </div>
    );
}
