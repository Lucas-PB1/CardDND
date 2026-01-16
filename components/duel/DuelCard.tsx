import { Card, CardType, MagicLevel } from "@/schemas/duelSchema";
import Image from "next/image";

interface DuelCardProps {
    card: Card;
    onClick?: () => void;
    size?: "sm" | "md" | "lg";
    className?: string;
    isPlayable?: boolean;
}

export function DuelCard({ card, onClick, size = "md", className = "", isPlayable = false }: DuelCardProps) {
    const sizeClasses = {
        sm: "w-24 h-36 text-[10px]",
        md: "w-40 h-56 text-xs",
        lg: "w-64 h-96 text-sm",
    };

    const typeColors = {
        [CardType.Attack]: "border-red-500 bg-red-50",
        [CardType.Magic]: "border-blue-500 bg-blue-50",
        [CardType.RaceAbility]: "border-green-500 bg-green-50",
        [CardType.ClassAbility]: "border-purple-500 bg-purple-50",
    };

    return (
        <div
            onClick={onClick}
            className={`
                relative flex flex-col border-2 rounded-lg shadow-md overflow-hidden transition-all duration-200
                ${sizeClasses[size]}
                ${typeColors[card.type as CardType] || "border-gray-500 bg-gray-50"}
                ${isPlayable ? "cursor-pointer hover:-translate-y-4 hover:shadow-xl hover:scale-105 z-10" : ""}
                ${className}
            `}
        >
            {/* Header */}
            <div className="px-2 py-1 font-bold truncate bg-white/50 border-b border-black/10">
                {card.name}
            </div>

            {/* Image */}
            <div className="relative flex-1 bg-gray-200">
                {card.imageUrl ? (
                    <Image src={card.imageUrl} alt={card.name} fill className="object-cover" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-dnd text-lg">
                        {card.type.charAt(0)}
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-2 space-y-1 bg-white/80 backdrop-blur-sm h-[45%] overflow-y-auto scrollbar-hide">
                <div className="flex justify-between items-center text-[10px] font-semibold opacity-70">
                    <span>{card.type}</span>
                    {card.type === CardType.Magic && card.magicLevel && (
                        <span>{card.magicLevel}</span>
                    )}
                </div>

                <div className="text-xs leading-tight">
                    {card.description}
                </div>

                {(card.damage || card.test) && (
                    <div className="pt-1 mt-1 border-t border-black/10 space-y-0.5">
                        {card.damage && (
                            <div className="flex items-center gap-1 font-mono text-[10px]">
                                <span className="font-bold">DMG:</span> {card.damage}
                            </div>
                        )}
                        {card.test && (
                            <div className="flex items-center gap-1 font-mono text-[10px]">
                                <span className="font-bold">DC:</span> {card.test}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
