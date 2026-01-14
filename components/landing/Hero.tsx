import Link from "next/link";

import { Button } from "@/components/ui/Button";

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-950 to-gray-950" />

            <div className="container mx-auto px-6 text-center">
                <h1 className="mb-6 text-5xl font-extrabold tracking-tight lg:text-7xl">
                    The Ultimate <span className="text-blue-500">D&D</span> Companion
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-gray-400">
                    Manage your campaigns, roll dice, and track your adventures with a system built
                    for Dungeon Masters and Players alike. Perfect for both online sessions and
                    offline table management.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Link href="/register">
                        <Button className="h-12 bg-blue-600 px-8 text-lg shadow-lg shadow-blue-500/20 hover:bg-blue-500">
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
