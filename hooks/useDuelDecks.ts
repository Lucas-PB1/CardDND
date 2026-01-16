import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { characterClient } from "@/services/characterClientService";
import { duelService } from "@/services/duelService";
import { Character } from "@/schemas/characterSchema";
import { Deck } from "@/schemas/duelSchema";

export function useDuelDecks() {
    const params = useParams();
    const characterId = params?.characterId as string;
    const { user } = useAuth();

    const [character, setCharacter] = useState<Character | null>(null);
    const [decks, setDecks] = useState<Deck[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const loadData = useCallback(async () => {
        if (!user || !characterId) return;

        setLoading(true);
        try {
            const [char, userDecks] = await Promise.all([
                characterClient.getCharacter(characterId),
                duelService.getDecks(user.uid, characterId)
            ]);
            setCharacter(char);
            setDecks(userDecks);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    }, [user, characterId]);

    useEffect(() => {
        if (user && characterId) {
            loadData();
        }
    }, [user, characterId, loadData]);

    const handleDeleteDeck = async (e: React.MouseEvent, deckId: string) => {
        e.preventDefault(); // Prevent navigation
        if (!confirm("Are you sure you want to delete this deck? All cards inside will be lost.")) return;

        if (user && characterId) {
            await duelService.deleteDeck(user.uid, characterId, deckId);
            loadData(); // Reload list
        }
    };

    return {
        character,
        decks,
        loading,
        user,
        characterId,
        isCreateModalOpen,
        setIsCreateModalOpen,
        handleDeleteDeck,
        loadData
    };
}
