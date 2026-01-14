import { auth } from "@/lib/firebase";
import { UserProfile } from "./userService";
import { FriendRequestWithProfile } from "./socialService";

async function getAuthHeaders() {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    const token = await user.getIdToken();
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    };
}

export async function searchUsersApi(query: string): Promise<UserProfile[]> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`, { headers });
    if (!res.ok) throw new Error("Failed to search users");
    return res.json();
}

export async function sendFriendRequestApi(recipientId: string) {
    const headers = await getAuthHeaders();
    const res = await fetch("/api/social/request", {
        method: "POST",
        headers,
        body: JSON.stringify({ recipientId })
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to send request");
    }
    return res.json();
}

export async function respondToRequestApi(requestId: string, status: "accepted" | "rejected") {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/social/request/${requestId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error("Failed to respond to request");
    return res.json();
}

export async function getSocialConnectionsApi(): Promise<FriendRequestWithProfile[]> {
    const headers = await getAuthHeaders();
    const res = await fetch("/api/social/friends", { headers });
    if (!res.ok) throw new Error("Failed to fetch connections");
    return res.json();
}

export async function cancelRequestApi(requestId: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/social/request/${requestId}`, {
        method: "DELETE",
        headers
    });
    if (!res.ok) throw new Error("Failed to cancel request");
    return res.json();
}
