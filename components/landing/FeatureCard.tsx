import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    colorClass: string;
}

export function FeatureCard({ title, description, icon: Icon, colorClass }: FeatureCardProps) {
    return (
        <div
            className={`rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-${colorClass}-500/30 transition-colors`}
        >
            <div
                className={`h-12 w-12 bg-${colorClass}-500/20 mb-4 flex items-center justify-center rounded-lg text-${colorClass}-400`}
            >
                <Icon className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-bold">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </div>
    );
}
