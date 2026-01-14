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

/**
 * Sends a friend request from requester to recipient.
 */
export async function sendFriendRequest(requesterId: string, recipientId: string) {
    if (requesterId === recipientId) throw new Error("Cannot add self");

    // Check if friendship already exists
    const query = await adminDb.collection(COLLECTION_FRIENDSHIPS)
        .where("requesterId", "in", [requesterId, recipientId])
        .where("recipientId", "in", [requesterId, recipientId])
        .get();

    if (!query.empty) {
        // If rejected, maybe allow re-sending? For now, just error.
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
export async function respondToFriendRequest(requestId: string, userId: string, status: "accepted" | "rejected") {
    const ref = adminDb.collection(COLLECTION_FRIENDSHIPS).doc(requestId);
    const doc = await ref.get();

    if (!doc.exists) throw new Error("Request not found");
    const data = doc.data() as Friendship;

    // Only the recipient can respond
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
 * Can be performed by requester (cancel) or either party (unfriend - future).
 * For now, only focused on canceling pending requests.
 */
export async function deleteFriendship(requestId: string, userId: string) {
    const ref = adminDb.collection(COLLECTION_FRIENDSHIPS).doc(requestId);
    const doc = await ref.get();

    if (!doc.exists) throw new Error("Request not found");
    const data = doc.data() as Friendship;

    // Allow deletion if user is requester OR recipient (reject/cancel/unfriend)
    if (data.requesterId !== userId && data.recipientId !== userId) {
        throw new Error("Unauthorized");
    }

    await ref.delete();
    return { id: requestId, deleted: true };
}

/**
 * Gets all friends (accepted status) and pending requests for a user.
 */
export async function getSocialConnections(userId: string) {
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
export async function searchUsers(query: string, currentUserId: string): Promise<UserProfile[]> {
    if (!query || query.length < 3) return [];

    const strSearch = query.toLowerCase();

    // Firestore doesn't support generic case-insensitive search easily without external tools like Algolia.
    // For this MVP, we will fetch users (limit 20) and filter in memory or rely on exact matches if needed.
    // Ideally, we'd store a `searchKey` lowercase field on the User document.

    // Attempting a hacky prefix search on displayName (assuming case sensitive matches for now, or fetch all users? No, too expensive).
    // Let's rely on exact email match OR partial displayName match if we had a searchKey.
    // Fallback: Fetch a limit of 50 recent users and filter? No.

    // Better approach for MVP: Simple scan. Or just exact email.
    // Let's implement exact email search first as it's reliable.

    // If we want partial name search, we really need a lowercase field.
    // I will assume for now we search by Exact Email or "Greater Than" displayName prefix if possible.

    const usersRef = adminDb.collection(COLLECTION_USERS);
    // Prefix search on displayName
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
