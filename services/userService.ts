import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase-admin";

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    birthDate?: FirebaseFirestore.Timestamp | Date | string;
    hasPlayedBefore: boolean;
    dndBeyondProfileUrl?: string;
    role: "user" | "admin";
    createdAt: FirebaseFirestore.Timestamp | Date | string;
    updatedAt: FirebaseFirestore.Timestamp | Date | string;
    isActive: boolean;
}

export interface AccessLog {
    uid: string;
    email: string;
    ipAddress?: string;
    userAgent?: string;
    timestamp: FirebaseFirestore.Timestamp | Date;
    action: "LOGIN" | "REGISTER" | "PASSWORD_RESET";
}

const COLLECTION_USERS = "users";
const COLLECTION_LOGS = "access_logs";

export class UserService {
    /**
     * Creates or updates a user profile in Firestore.
     * This is typically called after Firebase Auth registration.
     */
    async createUserProfile(uid: string, data: Partial<UserProfile>) {
        const userRef = adminDb.collection(COLLECTION_USERS).doc(uid);
        const now = new Date();

        const snapshot = await userRef.get();

        if (snapshot.exists) {
            await userRef.update({
                updatedAt: now,
                ...data,
            });
        } else {
            await userRef.set({
                uid,
                role: "user",
                isActive: true,
                createdAt: now,
                updatedAt: now,
                ...data,
            });
        }

        return { uid, ...data };
    }

    /**
     * Updates an existing user profile.
     */
    async updateUserProfile(uid: string, data: Partial<UserProfile>) {
        const userRef = adminDb.collection(COLLECTION_USERS).doc(uid);
        const now = new Date();

        await userRef.update({
            updatedAt: now,
            ...data,
        });

        return { uid, ...data };
    }

    /**
     * Logs a user action (e.g. login) to Firestore.
     */
    async logUserAccess(
        uid: string,
        email: string,
        action: AccessLog["action"],
        meta?: { ip?: string; ua?: string },
    ) {
        await adminDb.collection(COLLECTION_LOGS).add({
            uid,
            email,
            action,
            timestamp: FieldValue.serverTimestamp(),
            ipAddress: meta?.ip || null,
            userAgent: meta?.ua || null,
        });
    }

    /**
     * Retrieves a user profile by UID.
     */
    async getUserProfile(uid: string): Promise<UserProfile | null> {
        const doc = await adminDb.collection(COLLECTION_USERS).doc(uid).get();
        if (!doc.exists) return null;
        const data = doc.data();
        return {
            ...data,
            birthDate: data?.birthDate?.toDate ? data.birthDate.toDate() : data?.birthDate,
            createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : data?.createdAt,
            updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate() : data?.updatedAt,
        } as UserProfile;
    }

    /**
     * Retrieves all user profiles (Admin only).
     */
    async getAllUsers(): Promise<UserProfile[]> {
        const snapshot = await adminDb
            .collection(COLLECTION_USERS)
            .orderBy("createdAt", "desc")
            .get();
        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                ...data,
                birthDate: data.birthDate?.toDate ? data.birthDate.toDate() : data.birthDate,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
                updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
            } as UserProfile;
        });
    }

    /**
     * Retrieves user profiles by a list of UIDs.
     * Handles the Firestore constraint of max 10 items per 'in' query.
     */
    async getUsersByIds(uids: string[]): Promise<UserProfile[]> {
        if (uids.length === 0) return [];

        const uniqueUids = Array.from(new Set(uids));

        const chunks = [];
        for (let i = 0; i < uniqueUids.length; i += 10) {
            chunks.push(uniqueUids.slice(i, i + 10));
        }

        const promises = chunks.map((chunk) =>
            adminDb.collection(COLLECTION_USERS).where("uid", "in", chunk).get(),
        );

        const snapshots = await Promise.all(promises);
        const users = snapshots.flatMap((snap) =>
            snap.docs.map((doc) => {
                const data = doc.data();
                return {
                    ...data,
                    birthDate: data.birthDate?.toDate ? data.birthDate.toDate() : data.birthDate,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
                    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
                } as UserProfile;
            }),
        );

        return users;
    }
}

export const userService = new UserService();
