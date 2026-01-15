import { Character } from "@/schemas/characterSchema";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

interface CharacterCardProps {
    character: Character;
    onEdit: (character: Character) => void;
    onDelete: (characterId: string) => void;
}

export function CharacterCard({ character, onEdit, onDelete }: CharacterCardProps) {
    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-gray-900 shadow-lg transition-transform hover:scale-[1.02]">
            <div className="relative h-48 w-full bg-gray-800">
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
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4">
                    <h3 className="text-xl font-bold text-white shadow-sm">{character.name}</h3>
                    <p className="text-sm text-gray-300 shadow-sm">
                        Lvl {character.level} {character.class}
                    </p>
                </div>
            </div>

            <div className="flex flex-grow flex-col justify-between p-4">
                <div className="mb-4 space-y-2">
                    {character.subclass && (
                        <p className="text-sm text-gray-400">
                            <span className="font-semibold text-gray-500">Subclass:</span> {character.subclass}
                        </p>
                    )}
                    <div className="flex justify-between text-sm text-gray-400">
                        <span>💰 {character.gold} GP</span>
                        <span>✨ {character.experience} XP</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    {character.dndBeyondUrl && (
                        <Button
                            variant="primary"
                            className="flex-1 text-xs"
                            onClick={() => window.open(character.dndBeyondUrl!, "_blank")}
                            title="Open D&D Beyond Sheet"
                        >
                            Sheet
                        </Button>
                    )}
                    <Button
                        variant="secondary"
                        className="flex-1 text-xs"
                        onClick={() => onEdit(character)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="secondary"
                        className="flex-1 text-xs bg-red-600 hover:bg-red-700 focus:ring-red-800"
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this character?")) {
                                onDelete(character.id);
                            }
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}
