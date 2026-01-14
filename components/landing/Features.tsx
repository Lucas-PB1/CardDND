import { Dice5, Flame, Package, Sword, Wand, WifiOff } from "lucide-react";

import { FeatureCard } from "./FeatureCard";

const FEATURES = [
    {
        title: "Campaign Management",
        description: "Organize your NPCs, locations, and plot hooks in one centralized dashboard.",
        icon: Sword,
        colorClass: "blue",
    },
    {
        title: "Advanced Dice Roller",
        description:
            "Physics-based 3D dice rolling or quick formulas. Integrates with character stats.",
        icon: Dice5,
        colorClass: "purple",
    },
    {
        title: "Offline Mode",
        description:
            "Playing at a cabin in the woods? Access your sheets and notes without internet.",
        icon: WifiOff,
        colorClass: "emerald",
    },
    {
        title: "Character Builder",
        description:
            "Create characters in minutes with our guided wizard. Supports 5e rules automatically.",
        icon: Wand,
        colorClass: "orange",
    },
    {
        title: "Combat Tracker",
        description:
            "Track initiative, HP, and conditions seamlessly. Speed up your combat encounters.",
        icon: Flame,
        colorClass: "red",
    },
    {
        title: "Item Database",
        description:
            "Browse thousands of magical items and spells. Add them to your inventory with a click.",
        icon: Package,
        colorClass: "cyan",
    },
];

export function Features() {
    return (
        <section id="features" className="bg-gray-900/50 py-20">
            <div className="container mx-auto px-6">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold">Everything You Need</h2>
                    <p className="text-gray-400">Dozens of powerful tools at your fingertips.</p>
                </div>

                <div className="grid gap-8 text-left md:grid-cols-3">
                    {FEATURES.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            title={feature.title}
                            description={feature.description}
                            icon={feature.icon}
                            colorClass={feature.colorClass}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
