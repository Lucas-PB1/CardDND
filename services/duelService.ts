import {
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp,
    Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, Deck } from "@/schemas/duelSchema";

const COLLECTION_USERS = "users";
const COLLECTION_CHARACTERS = "characters";
const COLLECTION_DECKS = "decks";
const COLLECTION_CARDS = "cards";

export class DuelService {
    // --- Decks ---

    async createDeck(userId: string, characterId: string, data: Partial<Deck>) {
        const decksRef = collection(db, COLLECTION_USERS, userId, COLLECTION_CHARACTERS, characterId, COLLECTION_DECKS);
        const docRef = await addDoc(decksRef, {
            ...data,
            characterId,
            userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        const newDoc = await getDoc(docRef);
        const docData = newDoc.data();

        return {
            id: docRef.id,
            ...docData,
            createdAt: (docData?.createdAt as Timestamp)?.toDate().toISOString(),
            updatedAt: (docData?.updatedAt as Timestamp)?.toDate().toISOString(),
        } as Deck;
    }

    async getDecks(userId: string, characterId: string): Promise<Deck[]> {
        const decksRef = collection(db, COLLECTION_USERS, userId, COLLECTION_CHARACTERS, characterId, COLLECTION_DECKS);
        const q = query(decksRef, orderBy("updatedAt", "desc"));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
                updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
            } as Deck;
        });
    }

    async deleteDeck(userId: string, characterId: string, deckId: string) {
        const deckRef = doc(db, COLLECTION_USERS, userId, COLLECTION_CHARACTERS, characterId, COLLECTION_DECKS, deckId);
        await deleteDoc(deckRef);
    }

    async updateDeck(userId: string, characterId: string, deckId: string, data: Partial<Deck>) {
        const deckRef = doc(db, COLLECTION_USERS, userId, COLLECTION_CHARACTERS, characterId, COLLECTION_DECKS, deckId);

        await setDoc(deckRef, {
            ...data,
            updatedAt: serverTimestamp(),
        }, { merge: true });

        const updatedDoc = await getDoc(deckRef);
        const docData = updatedDoc.data();

        return {
            id: updatedDoc.id,
            ...docData,
            createdAt: (docData?.createdAt as Timestamp)?.toDate().toISOString(),
            updatedAt: (docData?.updatedAt as Timestamp)?.toDate().toISOString(),
        } as Deck;
    }

    async getDeck(userId: string, characterId: string, deckId: string): Promise<Deck | null> {
        const deckRef = doc(db, COLLECTION_USERS, userId, COLLECTION_CHARACTERS, characterId, COLLECTION_DECKS, deckId);
        const snapshot = await getDoc(deckRef);

        if (!snapshot.exists()) return null;

        const data = snapshot.data();
        return {
            id: snapshot.id,
            ...data,
            createdAt: data?.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data?.createdAt,
            updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data?.updatedAt,
        } as Deck;
    }


    // --- Cards ---

    async addCard(userId: string, characterId: string, deckId: string, data: Partial<Card>) {
        const cardsRef = collection(db, COLLECTION_USERS, userId, COLLECTION_CHARACTERS, characterId, COLLECTION_DECKS, deckId, COLLECTION_CARDS);

        const docRef = await addDoc(cardsRef, {
            ...data,
            deckId,
            characterId,
            userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        const newDoc = await getDoc(docRef);
        const docData = newDoc.data();

        return {
            id: docRef.id,
            ...docData,
            createdAt: (docData?.createdAt as Timestamp)?.toDate().toISOString(),
            updatedAt: (docData?.updatedAt as Timestamp)?.toDate().toISOString(),
        } as Card;
    }

    async getCards(userId: string, characterId: string, deckId: string): Promise<Card[]> {
        const cardsRef = collection(db, COLLECTION_USERS, userId, COLLECTION_CHARACTERS, characterId, COLLECTION_DECKS, deckId, COLLECTION_CARDS);
        const q = query(cardsRef, orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
                updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
            } as Card;
        });
    }

    async deleteCard(userId: string, characterId: string, deckId: string, cardId: string) {
        const cardRef = doc(db, COLLECTION_USERS, userId, COLLECTION_CHARACTERS, characterId, COLLECTION_DECKS, deckId, COLLECTION_CARDS, cardId);
        await deleteDoc(cardRef);
    }

    async updateCard(userId: string, characterId: string, deckId: string, cardId: string, data: Partial<Card>) {
        const cardRef = doc(db, COLLECTION_USERS, userId, COLLECTION_CHARACTERS, characterId, COLLECTION_DECKS, deckId, COLLECTION_CARDS, cardId);

        await setDoc(cardRef, {
            ...data,
            updatedAt: serverTimestamp(),
        }, { merge: true });

        const updatedDoc = await getDoc(cardRef);
        const docData = updatedDoc.data();

        return {
            id: updatedDoc.id,
            ...docData,
            createdAt: (docData?.createdAt as Timestamp)?.toDate().toISOString(),
            updatedAt: (docData?.updatedAt as Timestamp)?.toDate().toISOString(),
        } as Card;
    }
}

export const duelService = new DuelService();
