import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";

export function LandingPage() {
    return (
        <div className="min-h-screen bg-dnd-bg font-sans text-dnd-fg selection:bg-dnd-red/30">
            <Hero />
            <Features />
            <Footer />
        </div>
    );
}
