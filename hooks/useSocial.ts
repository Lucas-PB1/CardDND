import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { socialClient } from "@/services/socialClientService";
import { UserProfile } from "@/services/userService";
import { FriendRequestWithProfile } from "@/services/socialService";

export function useSocial() {
    const { user } = useAuth();

    const [friends, setFriends] = useState<FriendRequestWithProfile[]>([]);
    const [incomingRequests, setIncomingRequests] = useState<FriendRequestWithProfile[]>([]);
    const [sentRequests, setSentRequests] = useState<FriendRequestWithProfile[]>([]);
    const [searchResults, setSearchResults] = useState<UserProfile[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const loadConnections = useCallback(async () => {
        if (!user) return;
        try {
            setIsLoading(true);
            const data = await socialClient.getSocialConnections();

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
            const results = await socialClient.searchUsers(query);
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
            await socialClient.sendFriendRequest(recipientId);
            setSuccessMessage("Friend request sent!");
            setSearchResults(prev => prev.filter(u => u.uid !== recipientId));
            loadConnections();
        } catch (err) {
            const error = err as Error;
            setError(error.message || "Failed to send request");
        } finally {
            setActionLoading(null);
        }
    };

    const respondToRequest = async (requestId: string, status: "accepted" | "rejected") => {
        try {
            setActionLoading(requestId);
            await socialClient.respondToRequest(requestId, status);
            if (status === "accepted") {
                setSuccessMessage("Friend request accepted!");
                await loadConnections();
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
            await socialClient.cancelRequest(requestId);
            setSuccessMessage("Request cancelled.");
            setSentRequests(prev => prev.filter(r => r.id !== requestId));
        } catch (err) {
            setError("Failed to cancel request");
        } finally {
            setActionLoading(null);
        }
    }

    const removeFriend = async (friendshipId: string) => {
        try {
            setActionLoading(friendshipId);
            await socialClient.cancelRequest(friendshipId);
            setSuccessMessage("Friend removed.");
            setFriends(prev => prev.filter(f => f.id !== friendshipId));
        } catch (err) {
            setError("Failed to remove friend");
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
        removeFriend,
        clearMessages
    };
}
