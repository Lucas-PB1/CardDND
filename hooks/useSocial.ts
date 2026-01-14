import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    searchUsersApi,
    sendFriendRequestApi,
    respondToRequestApi,
    getSocialConnectionsApi,
    cancelRequestApi
} from "@/services/socialClientService";
import { UserProfile } from "@/services/userService";
import { FriendRequestWithProfile } from "@/services/socialService";

export function useSocial() {
    const { user } = useAuth();

    // State
    const [friends, setFriends] = useState<FriendRequestWithProfile[]>([]);
    const [incomingRequests, setIncomingRequests] = useState<FriendRequestWithProfile[]>([]);
    const [sentRequests, setSentRequests] = useState<FriendRequestWithProfile[]>([]); // New state
    const [searchResults, setSearchResults] = useState<UserProfile[]>([]);

    const [isLoading, setIsLoading] = useState(false); // Global loading for initial fetch
    const [actionLoading, setActionLoading] = useState<string | null>(null); // Track ID of item being acted on

    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const loadConnections = useCallback(async () => {
        if (!user) return;
        try {
            setIsLoading(true);
            const data = await getSocialConnectionsApi();

            // Filter connections (accepted vs pending)
            // Friend: status === 'accepted'
            // Pending: status === 'pending' AND isRequester === false (Incoming)
            // Sent: status === 'pending' AND isRequester === true (Outgoing - maybe show?)

            const myFriends = data.filter(c => c.status === "accepted");
            const incoming = data.filter(c => c.status === "pending" && !c.isRequester);
            const sent = data.filter(c => c.status === "pending" && c.isRequester);

            setFriends(myFriends);
            setIncomingRequests(incoming);
            setSentRequests(sent);
        } catch (err) {
            console.error(err);
            setError("Failed to load connections");
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadConnections();
    }, [loadConnections]);

    const searchUsers = async (query: string) => {
        if (!query) {
            setSearchResults([]);
            return;
        }
        try {
            setIsLoading(true);
            const results = await searchUsersApi(query);
            // Filter out users we already have connections with (optional, but good UX)
            // For now, let's keep them but UI can handle "already added" state if needed.
            setSearchResults(results);
        } catch (err) {
            setError("Search failed");
        } finally {
            setIsLoading(false);
        }
    };

    const sendRequest = async (recipientId: string) => {
        try {
            setActionLoading(recipientId);
            await sendFriendRequestApi(recipientId);
            setSuccessMessage("Friend request sent!");
            setSearchResults(prev => prev.filter(u => u.uid !== recipientId));
            loadConnections(); // Refresh lists to show in Sent
        } catch (err: any) {
            setError(err.message || "Failed to send request");
        } finally {
            setActionLoading(null);
        }
    };

    const respondToRequest = async (requestId: string, status: "accepted" | "rejected") => {
        try {
            setActionLoading(requestId);
            await respondToRequestApi(requestId, status);
            if (status === "accepted") {
                setSuccessMessage("Friend request accepted!");
                await loadConnections(); // Reload to update lists
            } else {
                setSuccessMessage("Request rejected.");
                setIncomingRequests(prev => prev.filter(r => r.id !== requestId));
            }
        } catch (err) {
            setError("Failed to respond");
        } finally {
            setActionLoading(null);
        }
    };

    const cancelRequest = async (requestId: string) => {
        try {
            setActionLoading(requestId);
            await cancelRequestApi(requestId);
            setSuccessMessage("Request cancelled.");
            setSentRequests(prev => prev.filter(r => r.id !== requestId));
        } catch (err) {
            setError("Failed to cancel request");
        } finally {
            setActionLoading(null);
        }
    }

    const clearMessages = () => {
        setError(null);
        setSuccessMessage(null);
    }

    return {
        friends,
        incomingRequests,
        sentRequests,
        searchResults,
        searchQuery,
        setSearchQuery,
        isLoading,
        actionLoading,
        error,
        successMessage,
        searchUsers,
        sendRequest,
        respondToRequest,
        cancelRequest,
        clearMessages
    };
}
