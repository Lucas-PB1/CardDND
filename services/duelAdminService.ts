import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { Card, Deck } from "@/schemas/duelSchema";

const COLLECTION_USERS = "users";
const COLLECTION_CHARACTERS = "characters";
const COLLECTION_DECKS = "decks";
const COLLECTION_CARDS = "cards";

export class DuelService {
    // --- Decks ---

    async createDeck(userId: string, characterId: string, data: Partial<Deck>) {
        const deckRef = adminDb
            .collection(COLLECTION_USERS)
            .doc(userId)
            .collection(COLLECTION_CHARACTERS)
            .doc(characterId)
            .collection(COLLECTION_DECKS)
            .doc();

        const now = new Date();
        const deckData = {
            id: deckRef.id,
            characterId,
            userId,
            ...data,
            createdAt: now,
            updatedAt: now,
        };

        await deckRef.set(deckData);

        return {
            ...deckData,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        } as Deck;
    }

    async getDecks(userId: string, characterId: string): Promise<Deck[]> {
        const snapshot = await adminDb
            .collection(COLLECTION_USERS)
            .doc(userId)
            .collection(COLLECTION_CHARACTERS)
            .doc(characterId)
            .collection(COLLECTION_DECKS)
            .orderBy("updatedAt", "desc")
            .get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                ...data,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
                updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
            } as Deck;
        });
    }

    async deleteDeck(userId: string, characterId: string, deckId: string) {
        await adminDb
            .collection(COLLECTION_USERS)
            .doc(userId)
            .collection(COLLECTION_CHARACTERS)
            .doc(characterId)
            .collection(COLLECTION_DECKS)
            .doc(deckId)
            .delete();
    }

    async getDeck(userId: string, characterId: string, deckId: string): Promise<Deck | null> {
        const doc = await adminDb
            .collection(COLLECTION_USERS)
            .doc(userId)
            .collection(COLLECTION_CHARACTERS)
            .doc(characterId)
            .collection(COLLECTION_DECKS)
            .doc(deckId)
            .get();

        if (!doc.exists) return null;

        const data = doc.data();
        return {
            ...data,
            createdAt: data?.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data?.createdAt,
            updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data?.updatedAt,
        } as Deck;
    }


    // --- Cards ---

    async addCard(userId: string, characterId: string, deckId: string, data: Partial<Card>) {
        const cardRef = adminDb
            .collection(COLLECTION_USERS)
            .doc(userId)
            .collection(COLLECTION_CHARACTERS)
            .doc(characterId)
            .collection(COLLECTION_DECKS)
            .doc(deckId)
            .collection(COLLECTION_CARDS)
            .doc();

        const now = new Date();
        const cardData = {
            id: cardRef.id,
            deckId,
            characterId,
            userId,
            ...data,
            createdAt: now,
            updatedAt: now,
        };

        await cardRef.set(cardData);

        return {
            ...cardData,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        } as Card;
    }

    async getCards(userId: string, characterId: string, deckId: string): Promise<Card[]> {
        const snapshot = await adminDb
            .collection(COLLECTION_USERS)
            .doc(userId)
            .collection(COLLECTION_CHARACTERS)
            .doc(characterId)
            .collection(COLLECTION_DECKS)
            .doc(deckId)
            .collection(COLLECTION_CARDS)
            .orderBy("createdAt", "asc")
            .get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                ...data,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
                updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
            } as Card;
        });
    }

    async deleteCard(userId: string, characterId: string, deckId: string, cardId: string) {
        await adminDb
            .collection(COLLECTION_USERS)
            .doc(userId)
            .collection(COLLECTION_CHARACTERS)
            .doc(characterId)
            .collection(COLLECTION_DECKS)
            .doc(deckId)
            .collection(COLLECTION_CARDS)
            .doc(cardId)
            .delete();
    }
}

export const duelService = new DuelService();
