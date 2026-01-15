"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Character, CharacterFormData } from "@/schemas/characterSchema";
import { characterClient } from "@/services/characterClientService";
import { CharacterCard } from "./CharacterCard";
import { CharacterForm } from "./CharacterForm";
import { Button } from "@/components/ui/Button";

export function CharacterListManager() {
    const { user } = useAuth();
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<"list" | "create" | "edit">("list");
    const [selectedChar, setSelectedChar] = useState<Character | undefined>(undefined);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (user) {
            loadCharacters();
        }
    }, [user]);

    const loadCharacters = async () => {
        try {
            setLoading(true);
            const data = await characterClient.getCharacters();
            setCharacters(data);
        } catch (error) {
            console.error("Failed to load characters", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data: CharacterFormData) => {
        if (!user) return;
        try {
            setActionLoading(true);
            await characterClient.createCharacterWithImage(user.uid, data);
            await loadCharacters();
            setView("list");
        } catch (error) {
            console.error("Failed to create character", error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdate = async (data: CharacterFormData) => {
        if (!user || !selectedChar) return;
        try {
            setActionLoading(true);
            await characterClient.updateCharacterWithImage(user.uid, selectedChar.id, data);
            await loadCharacters();
            setView("list");
            setSelectedChar(undefined);
        } catch (error) {
            console.error("Failed to update character", error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (characterId: string) => {
        try {
            await characterClient.deleteCharacter(characterId);
            setCharacters((prev) => prev.filter((c) => c.id !== characterId));
        } catch (error) {
            console.error("Failed to delete character", error);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (view === "create") {
        return (
            <CharacterForm
                onSubmit={handleCreate}
                onCancel={() => setView("list")}
                isLoading={actionLoading}
            />
        );
    }

    if (view === "edit" && selectedChar) {
        return (
            <CharacterForm
                initialData={selectedChar}
                onSubmit={handleUpdate}
                onCancel={() => {
                    setView("list");
                    setSelectedChar(undefined);
                }}
                isLoading={actionLoading}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">My Characters</h2>
                <Button onClick={() => setView("create")}>+ Add Character</Button>
            </div>

            {characters.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-700 p-12 text-center text-gray-500">
                    <p className="mb-4">No characters found.</p>
                    <Button variant="outline" onClick={() => setView("create")}>
                        Create your first character
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {characters.map((char) => (
                        <CharacterCard
                            key={char.id}
                            character={char}
                            onEdit={(c) => {
                                setSelectedChar(c);
                                setView("edit");
                            }}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
