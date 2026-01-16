import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { characterClient } from "@/services/characterClientService";
import { duelService } from "@/services/duelService";
import { Character } from "@/schemas/characterSchema";
import { Card, Deck } from "@/schemas/duelSchema";

export const MAX_CARDS = 20;

export function useDeckDetails(characterId: string, deckId: string) {
    const { user } = useAuth();
    const [character, setCharacter] = useState<Character | null>(null);
    const [deck, setDeck] = useState<Deck | null>(null);
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
    const [isEditDeckModalOpen, setIsEditDeckModalOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<Card | null>(null);

    useEffect(() => {
        if (user && characterId && deckId) {
            loadData();
        }
    }, [user, characterId, deckId]);

    const loadData = async () => {
        if (!user || !characterId || !deckId) return;
        setLoading(true);
        try {
            const [char, d, c] = await Promise.all([
                characterClient.getCharacter(characterId),
                duelService.getDeck(user.uid, characterId, deckId),
                duelService.getCards(user.uid, characterId, deckId)
            ]);
            setCharacter(char);
            setDeck(d);
            setCards(c);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCard = async (cardId: string) => {
        if (!confirm("Are you sure you want to remove this card?")) return;
        if (user && characterId && deckId) {
            await duelService.deleteCard(user.uid, characterId, deckId, cardId);
            loadData();
        }
    };

    return {
        user,
        character,
        deck,
        cards,
        loading,
        modals: {
            isAddCardModalOpen,
            setIsAddCardModalOpen,
            isEditDeckModalOpen,
            setIsEditDeckModalOpen,
            editingCard,
            setEditingCard
        },
        actions: {
            loadData,
            handleDeleteCard
        }
    };
}
