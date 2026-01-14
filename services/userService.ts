import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    birthDate?: FirebaseFirestore.Timestamp | Date; // Added
    hasPlayedBefore: boolean;
    role: "user" | "admin";
    createdAt: FirebaseFirestore.Timestamp | Date;
    updatedAt: FirebaseFirestore.Timestamp | Date;
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

/**
 * Creates or updates a user profile in Firestore.
 * This is typically called after Firebase Auth registration.
 */
export async function createUserProfile(uid: string, data: Partial<UserProfile>) {
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
export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
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
export async function logUserAccess(uid: string, email: string, action: AccessLog["action"], meta?: { ip?: string, ua?: string }) {
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
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
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
export async function getAllUsers(): Promise<UserProfile[]> {
    const snapshot = await adminDb.collection(COLLECTION_USERS).orderBy("createdAt", "desc").get();
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            birthDate: data.birthDate?.toDate ? data.birthDate.toDate() : data.birthDate,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
        } as UserProfile;
    });
}
