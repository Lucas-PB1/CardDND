import { useState, useEffect, useCallback } from "react";
import { User } from "firebase/auth";
import { Character, CharacterFormData } from "@/schemas/characterSchema";
import { characterClient } from "@/services/characterClientService";

export function useCharacters(user: User | null) {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<"list" | "create" | "edit">("list");
    const [selectedChar, setSelectedChar] = useState<Character | undefined>(undefined);
    const [actionLoading, setActionLoading] = useState(false);

    const loadCharacters = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const data = await characterClient.getCharacters();
            setCharacters(data);
        } catch (error) {
            console.error("Failed to load characters", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            loadCharacters();
        }
    }, [user, loadCharacters]);

    const handleCreate = async (data: CharacterFormData) => {
        if (!user) return;
        try {
            setActionLoading(true);
            await characterClient.createCharacterWithImage(user.uid, data);
            await loadCharacters();
            setView("list");
        } catch (error) {
            console.error("Failed to create character", error);
            throw error;
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
            throw error;
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

    const openCreate = () => setView("create");
    const openEdit = (char: Character) => {
        setSelectedChar(char);
        setView("edit");
    };
    const closeForm = () => {
        setView("list");
        setSelectedChar(undefined);
    };

    return {
        characters,
        loading,
        view,
        selectedChar,
        actionLoading,
        handleCreate,
        handleUpdate,
        handleDelete,
        openCreate,
        openEdit,
        closeForm,
    };
}
