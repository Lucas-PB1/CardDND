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
    Timestamp,
    onSnapshot,
    Unsubscribe
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, Deck, DuelMatch, DuelPlayer, DuelPhase } from "@/schemas/duelSchema";

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

    // --- Match System ---

    async createMatch(userId: string, characterId: string, characterName: string, characterHp: number, deck: Card[]) {
        const matchesRef = collection(db, "matches");

        // Shuffle deck
        const shuffledDeck = [...deck].sort(() => Math.random() - 0.5);

        // Draw initial hand (5 cards)
        const hand = shuffledDeck.splice(0, 5);

        const player1: DuelPlayer = {
            userId,
            characterId,
            name: characterName,
            hp: characterHp,
            maxHp: characterHp,
            deck: shuffledDeck,
            hand,
            field: [],
            graveyard: []
        };

        const docRef = await addDoc(matchesRef, {
            players: [player1],
            currentTurnUserId: userId,
            phase: DuelPhase.Draw,
            turnCount: 1,
            log: [`Match started by ${characterName}`],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return docRef.id;
    }

    async joinMatch(matchId: string, userId: string, characterId: string, characterName: string, characterHp: number, deck: Card[]) {
        const matchRef = doc(db, "matches", matchId);
        const matchSnap = await getDoc(matchRef);

        if (!matchSnap.exists()) throw new Error("Match not found");

        const data = matchSnap.data();
        if (data.players.length >= 2) throw new Error("Match full");

        const shuffledDeck = [...deck].sort(() => Math.random() - 0.5);
        const hand = shuffledDeck.splice(0, 5);

        const player2: DuelPlayer = {
            userId,
            characterId,
            name: characterName,
            hp: characterHp,
            maxHp: characterHp,
            deck: shuffledDeck,
            hand,
            field: [],
            graveyard: []
        };

        await setDoc(matchRef, {
            players: [...data.players, player2],
            log: [...data.log, `${characterName} joined the duel`],
            updatedAt: serverTimestamp()
        }, { merge: true });
    }

    async drawCard(matchId: string, userId: string) {
        const matchRef = doc(db, "matches", matchId);
        const matchSnap = await getDoc(matchRef);
        if (!matchSnap.exists()) return;

        const data = matchSnap.data() as DuelMatch;
        const playerIndex = data.players.findIndex(p => p.userId === userId);
        if (playerIndex === -1) return;

        const player = data.players[playerIndex];

        if (player.deck.length === 0) {
            if (player.graveyard.length === 0) return;
            player.deck = [...player.graveyard].sort(() => Math.random() - 0.5);
            player.graveyard = [];
        }

        const card = player.deck.shift();
        if (card) {
            player.hand.push(card);

            const newLog = [...data.log, `${player.name} drew a card`];

            const updatedPlayers = [...data.players];
            updatedPlayers[playerIndex] = player;

            await setDoc(matchRef, {
                players: updatedPlayers,
                log: newLog,
                updatedAt: serverTimestamp()
            }, { merge: true });
        }
    }

    async playCard(matchId: string, userId: string, cardId: string) {
        const matchRef = doc(db, "matches", matchId);
        const matchSnap = await getDoc(matchRef);
        if (!matchSnap.exists()) return;

        const data = matchSnap.data() as DuelMatch;
        const playerIndex = data.players.findIndex(p => p.userId === userId);
        if (playerIndex === -1) return;

        const player = data.players[playerIndex];
        const cardIndex = player.hand.findIndex(c => c.id === cardId);

        if (cardIndex === -1) return;

        const [card] = player.hand.splice(cardIndex, 1);
        player.field.push(card);

        const newLog = [...data.log, `${player.name} played ${card.name}`];

        const updatedPlayers = [...data.players];
        updatedPlayers[playerIndex] = player;

        await setDoc(matchRef, {
            players: updatedPlayers,
            log: newLog,
            updatedAt: serverTimestamp()
        }, { merge: true });
    }

    async endTurn(matchId: string, userId: string) {
        const matchRef = doc(db, "matches", matchId);
        const matchSnap = await getDoc(matchRef);
        if (!matchSnap.exists()) return;

        const data = matchSnap.data() as DuelMatch;
        const nextPlayer = data.players.find(p => p.userId !== userId);

        if (!nextPlayer) return;

        await setDoc(matchRef, {
            currentTurnUserId: nextPlayer.userId,
            turnCount: data.turnCount + 1,
            phase: DuelPhase.Draw,
            log: [...data.log, `Turn ended. ${nextPlayer.name}'s turn.`],
            updatedAt: serverTimestamp()
        }, { merge: true });
    }

    subscribeToMatch(matchId: string, callback: (match: DuelMatch | null) => void): Unsubscribe {
        const matchRef = doc(db, "matches", matchId);
        return onSnapshot(matchRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                callback({
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
                    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
                } as DuelMatch);
            } else {
                callback(null);
            }
        });
    }
}

export const duelService = new DuelService();
