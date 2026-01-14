import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-950 to-gray-950 -z-10" />
      
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">
          The Ultimate <span className="text-blue-500">D&D</span> Companion
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Manage your campaigns, roll dice, and track your adventures with a system built for 
          Dungeon Masters and Players alike. Perfect for both online sessions and offline table management.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <Link href="/register">
            <Button className="h-12 px-8 text-lg bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20">
              Start Your Adventure
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="secondary" className="h-12 px-8 text-lg">
              Explore Features
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
