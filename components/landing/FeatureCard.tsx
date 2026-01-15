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
            className={`rounded-2xl border border-border bg-dnd-card p-8 transition-colors hover:border-dnd-red/50`}
        >
            <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg bg-dnd-red/10 mb-4 text-dnd-crimson`}
            >
                <Icon className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-bold">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}
