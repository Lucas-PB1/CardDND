import React from "react";
import Image from "next/image";
import { Character } from "@/schemas/characterSchema";
import { Button } from "@/components/ui/Button";

interface CharacterCardHeaderProps {
    character: Character;
}

export const CharacterCardHeader = ({ character }: CharacterCardHeaderProps) => (
    <div className="relative h-48 w-full bg-dnd-border">
        {character.imageUrl ? (
            <Image
                src={character.imageUrl}
                alt={character.name}
                fill
                className="object-cover"
            />
        ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-600">
                <span className="text-4xl">🐉</span>
            </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dnd-card to-transparent p-4">
            <h3 className="text-xl font-bold text-dnd-fg shadow-sm">{character.name}</h3>
            <p className="text-sm font-medium text-dnd-fg/80 shadow-sm">
                <span className="text-dnd-gold font-black uppercase tracking-tight">LVL {character.level}</span> {character.race ? `${character.race} ` : ""}{character.class}
            </p>
        </div>
    </div>
);

interface CharacterCardStatsProps {
    character: Character;
}

export const CharacterCardStats = ({ character }: CharacterCardStatsProps) => (
    <div className="mb-4 space-y-2">
        {character.subclass && (
            <p className="text-sm text-dnd-fg/60">
                <span className="font-semibold text-dnd-fg/40">Subclass:</span> {character.subclass}
            </p>
        )}
        <div className="flex justify-between text-[11px] font-bold tracking-tight text-gray-500 uppercase">
            <span>💰 {character.gold} GP</span>
            <span className="text-dnd-gold/80">✨ {character.experience} XP</span>
        </div>
        {(character.hp?.max !== undefined || character.armorClass !== undefined) && (
            <div className="flex justify-between text-sm text-dnd-fg/60 border-t border-dnd-border pt-2">
                {character.hp && (
                    <span className="font-medium">❤️ {character.hp.current}/{character.hp.max} HP</span>
                )}
                {character.armorClass !== undefined && (
                    <span className="font-medium">🛡️ AC {character.armorClass}</span>
                )}
            </div>
        )}
    </div>
);

interface CharacterCardActionsProps {
    character: Character;
    onEdit: (character: Character) => void;
    onDelete: (characterId: string) => void;
}

export const CharacterCardActions = ({ character, onEdit, onDelete }: CharacterCardActionsProps) => (
    <div className="flex gap-2">
        {character.dndBeyondUrl && (
            <Button
                variant="outline"
                className="flex-1 text-xs border-dnd-crimson/20 hover:border-dnd-crimson hover:bg-dnd-crimson/5 text-dnd-crimson"
                onClick={() => window.open(character.dndBeyondUrl!, "_blank")}
                title="Open D&D Beyond Sheet"
            >
                Sheet
            </Button>
        )}
        <Button
            variant="outline"
            className="flex-1 text-xs hover:border-dnd-fg/50"
            onClick={() => onEdit(character)}
        >
            Edit
        </Button>
        <Button
            variant="ghost"
            className="flex-1 text-xs text-dnd-red hover:bg-dnd-red/10 hover:text-dnd-red"
            onClick={() => {
                if (confirm("Are you sure you want to delete this character?")) {
                    onDelete(character.id);
                }
            }}
        >
            Delete
        </Button>
    </div>
);
