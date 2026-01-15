import { Character } from "@/schemas/characterSchema";
import {
    CharacterCardHeader,
    CharacterCardStats,
    CharacterCardActions
} from "./CharacterCardParts";

interface CharacterCardProps {
    character: Character;
    onEdit: (character: Character) => void;
    onDelete: (characterId: string) => void;
}

export function CharacterCard({ character, onEdit, onDelete }: CharacterCardProps) {
    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-dnd-card shadow-lg transition-transform hover:scale-[1.02]">
            <CharacterCardHeader character={character} />

            <div className="flex flex-grow flex-col justify-between p-4">
                <CharacterCardStats character={character} />
                <CharacterCardActions
                    character={character}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </div>
        </div>
    );
}
