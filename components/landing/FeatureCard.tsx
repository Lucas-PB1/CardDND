import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
}

export function FeatureCard({ title, description, icon: Icon, colorClass }: FeatureCardProps) {
  return (
    <div className={`p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-${colorClass}-500/30 transition-colors`}>
      <div className={`w-12 h-12 bg-${colorClass}-500/20 rounded-lg flex items-center justify-center mb-4 text-${colorClass}-400`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
