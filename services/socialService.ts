import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { UserProfile } from "./userService";

const COLLECTION_FRIENDSHIPS = "friendships";
const COLLECTION_USERS = "users";

export interface Friendship {
    id: string;
    requesterId: string;
    recipientId: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: FirebaseFirestore.Timestamp | Date;
    updatedAt: FirebaseFirestore.Timestamp | Date;
}

export interface FriendRequestWithProfile extends Friendship {
    profile: UserProfile;
    isRequester: boolean;
}

export class SocialService {
    /**
     * Sends a friend request from requester to recipient.
     */
    async sendFriendRequest(requesterId: string, recipientId: string) {
        if (requesterId === recipientId) throw new Error("Cannot add self");

        const query = await adminDb.collection(COLLECTION_FRIENDSHIPS)
            .where("requesterId", "in", [requesterId, recipientId])
            .where("recipientId", "in", [requesterId, recipientId])
            .get();

        if (!query.empty) {
            throw new Error("Friendship request already exists");
        }

        const ref = adminDb.collection(COLLECTION_FRIENDSHIPS).doc();
        await ref.set({
            id: ref.id,
            requesterId,
            recipientId,
            status: "pending",
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        return { id: ref.id, status: "pending" };
    }

    /**
     * Responds to a friend request (Accept/Reject).
     */
    async respondToFriendRequest(requestId: string, userId: string, status: "accepted" | "rejected") {
        const ref = adminDb.collection(COLLECTION_FRIENDSHIPS).doc(requestId);
        const doc = await ref.get();

        if (!doc.exists) throw new Error("Request not found");
        const data = doc.data() as Friendship;

        if (data.recipientId !== userId) {
            throw new Error("Unauthorized");
        }

        await ref.update({
            status,
            updatedAt: FieldValue.serverTimestamp(),
        });
    }

    /**
     * Cancels or deletes a friend request/friendship.
     */
    async deleteFriendship(requestId: string, userId: string) {
        const ref = adminDb.collection(COLLECTION_FRIENDSHIPS).doc(requestId);
        const doc = await ref.get();

        if (!doc.exists) throw new Error("Request not found");
        const data = doc.data() as Friendship;

        if (data.requesterId !== userId && data.recipientId !== userId) {
            throw new Error("Unauthorized");
        }

        await ref.delete();
        return { id: requestId, deleted: true };
    }

    /**
     * Gets all friends (accepted status) and pending requests for a user.
     */
    async getSocialConnections(userId: string) {
        const [asRequester, asRecipient] = await Promise.all([
            adminDb.collection(COLLECTION_FRIENDSHIPS).where("requesterId", "==", userId).get(),
            adminDb.collection(COLLECTION_FRIENDSHIPS).where("recipientId", "==", userId).get()
        ]);

        const connections: Friendship[] = [
            ...asRequester.docs.map(d => d.data() as Friendship),
            ...asRecipient.docs.map(d => d.data() as Friendship)
        ];

        return connections;
    }

    /**
     * Searches for users by email or displayName (prefix match).
     * Excludes self.
     */
    async searchUsers(query: string, currentUserId: string): Promise<UserProfile[]> {
        if (!query || query.length < 3) return [];

        const strSearch = query.toLowerCase();

        const usersRef = adminDb.collection(COLLECTION_USERS);
        const nameSnapshot = await usersRef
            .where("displayName", ">=", query)
            .where("displayName", "<=", query + '\uf8ff')
            .limit(10)
            .get();

        let results = nameSnapshot.docs.map(d => d.data() as UserProfile);

        const emailSnapshot = await usersRef.where("email", "==", query).get();
        const emailResults = emailSnapshot.docs.map(d => d.data() as UserProfile);

        const all = [...results, ...emailResults];
        const unique = Array.from(new Map(all.map(item => [item.uid, item])).values());

        return unique.filter(u => u.uid !== currentUserId);
    }
}

export const socialService = new SocialService();

