import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase-admin";
import { Character } from "@/schemas/characterSchema";

const COLLECTION_USERS = "users";
const COLLECTION_CHARACTERS = "characters";

export class CharacterService {
    /**
     * Creates a new character for a specific user.
     */
    async createCharacter(userId: string, data: Partial<Character>) {
        const charRef = adminDb
            .collection(COLLECTION_USERS)
            .doc(userId)
            .collection(COLLECTION_CHARACTERS)
            .doc(); // Auto-ID

        const now = new Date();
        const characterData = {
            id: charRef.id,
            userId,
            ...data,
            createdAt: now,
            updatedAt: now,
        };

        await charRef.set(characterData);

        return {
            ...characterData,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        } as Character;
    }

    /**
     * Retrieves all characters for a specific user.
     */
    async getCharacters(userId: string): Promise<Character[]> {
        const snapshot = await adminDb
            .collection(COLLECTION_USERS)
            .doc(userId)
            .collection(COLLECTION_CHARACTERS)
            .orderBy("updatedAt", "desc")
            .get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                ...data,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
                updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
            } as Character;
        });
    }

    /**
     * Retrieves a single character by ID.
     */
    async getCharacter(userId: string, characterId: string): Promise<Character | null> {
        const doc = await adminDb
            .collection(COLLECTION_USERS)
            .doc(userId)
            .collection(COLLECTION_CHARACTERS)
            .doc(characterId)
            .get();

        if (!doc.exists) return null;

        const data = doc.data();
        return {
            ...data,
            createdAt: data?.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data?.createdAt,
            updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data?.updatedAt,
        } as Character;
    }

    /**
     * Updates an existing character.
     */
    async updateCharacter(userId: string, characterId: string, data: Partial<Character>) {
        const charRef = adminDb
            .collection(COLLECTION_USERS)
            .doc(userId)
            .collection(COLLECTION_CHARACTERS)
            .doc(characterId);

        const now = new Date();
        const updateData = {
            ...data,
            updatedAt: now,
        };

        await charRef.update(updateData);

        return {
            id: characterId,
            userId,
            ...updateData,
            updatedAt: now.toISOString(),
        };
    }

    /**
     * Deletes a character.
     */
    async deleteCharacter(userId: string, characterId: string) {
        await adminDb
            .collection(COLLECTION_USERS)
            .doc(userId)
            .collection(COLLECTION_CHARACTERS)
            .doc(characterId)
            .delete();
    }
}

export const characterService = new CharacterService();
