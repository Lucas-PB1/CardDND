"use client";

import { useState } from "react";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { ChatWindow } from "@/components/chat/ChatWindow";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/hooks/useChat";
import { useSmartDeeplink } from "@/hooks/useSmartDeeplink";
import { useSocial } from "@/hooks/useSocial";
import { UserProfile } from "@/services/userService";

import { UserCard } from "./UserCard";

const MySwal = withReactContent(Swal);

export default function SocialDashboard() {
    const {
        friends,
        incomingRequests,
        sentRequests,
        searchResults,
        searchQuery,
        setSearchQuery,
        isLoading,
        actionLoading,
        searchUsers,
        sendRequest,
        respondToRequest,
        cancelRequest,
        removeFriend,
        error,
        successMessage,
        clearMessages,
    } = useSocial();

    const [activeTab, setActiveTab] = useState<"friends" | "requests" | "sent" | "find">("friends");

    useSmartDeeplink({
        param: "tab",
        validValues: ["friends", "requests", "sent", "find"],
        onMatch: (val) => setActiveTab(val),
        clearOnMatch: true,
    });

    const { user: currentUser } = useAuth();
    const {
        isOpen: isChatOpen,
        messages: chatMessages,
        sendMessage,
        openChat,
        closeChat,
        isLoading: isChatLoading,
    } = useChat();
    const [chatRecipient, setChatRecipient] = useState<UserProfile | null>(null);

    const handleMessage = (recipient: UserProfile) => {
        setChatRecipient(recipient);
        openChat(recipient.uid);
    };

    const handleCloseChat = () => {
        closeChat();
        setChatRecipient(null);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchUsers(searchQuery);
    };

    return (
        <div className="min-h-screen bg-dnd-bg px-6 pt-24 leading-relaxed text-dnd-fg">
            <div className="container mx-auto max-w-4xl">
                <h1 className="mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-3xl font-bold text-transparent">
                    Social Hub
                </h1>
                <p className="mb-8 text-muted-foreground">
                    Connect with other players and build your party.
                </p>

                {/* Tabs */}
                <div className="mb-8 flex gap-4 overflow-x-auto border-b border-white/10">
                    <button
                        onClick={() => setActiveTab("friends")}
                        className={`border-b-2 px-2 pb-3 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === "friends" ? "border-dnd-blue text-dnd-blue" : "border-transparent text-muted-foreground hover:text-dnd-fg"}`}
                    >
                        My Friends ({friends.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("requests")}
                        className={`border-b-2 px-2 pb-3 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === "requests" ? "border-dnd-crimson text-dnd-crimson" : "border-transparent text-muted-foreground hover:text-dnd-fg"}`}
                    >
                        Requests ({incomingRequests.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("sent")}
                        className={`border-b-2 px-2 pb-3 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === "sent" ? "border-dnd-gold text-dnd-gold" : "border-transparent text-muted-foreground hover:text-dnd-fg"}`}
                    >
                        Sent ({sentRequests.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("find")}
                        className={`border-b-2 px-2 pb-3 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === "find" ? "border-green-600 text-green-600" : "border-transparent text-muted-foreground hover:text-dnd-fg"}`}
                    >
                        Find Players
                    </button>
                </div>

                {/* Messages */}
                {error && (
                    <div className="mb-6 flex items-center justify-between rounded-xl bg-destructive/10 p-4 text-destructive">
                        {error}
                        <button
                            onClick={clearMessages}
                            className="text-xs opacity-70 hover:opacity-100"
                        >
                            Dismiss
                        </button>
                    </div>
                )}
                {successMessage && (
                    <div className="mb-6 flex items-center justify-between rounded-xl bg-green-100 p-4 text-green-800">
                        {successMessage}
                        <button
                            onClick={clearMessages}
                            className="text-xs opacity-70 hover:opacity-100"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="space-y-4">
                    {isLoading && <div className="py-8 text-center text-muted-foreground">Loading...</div>}

                    {!isLoading && activeTab === "friends" && (
                        <div>
                            {friends.length === 0 ? (
                                <div className="py-12 text-center text-muted-foreground">
                                    <p>You haven&apos;t added any friends yet.</p>
                                    <Button
                                        onClick={() => setActiveTab("find")}
                                        variant="secondary"
                                        className="mt-4"
                                    >
                                        Find Players
                                    </Button>
                                </div>
                            ) : (
                                friends.map((friend) => (
                                    <UserCard
                                        key={friend.id}
                                        user={friend.profile}
                                        actionLabel="Message"
                                        onAction={() => handleMessage(friend.profile)}
                                        secondaryActionLabel="Remove"
                                        onSecondaryAction={() => {
                                            MySwal.fire({
                                                title: "Remove Friend?",
                                                text: "Are you sure you want to remove this friend? This action cannot be undone.",
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonColor: "#EF4444",
                                                cancelButtonColor: "#3B82F6",
                                                confirmButtonText: "Yes, remove",
                                                background: "#111827",
                                                color: "#fff",
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    removeFriend(friend.id);
                                                }
                                            });
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    )}

                    {!isLoading && activeTab === "requests" && (
                        <div>
                            {incomingRequests.length === 0 ? (
                                <div className="py-12 text-center text-muted-foreground">
                                    <p>No pending friend requests.</p>
                                </div>
                            ) : (
                                incomingRequests.map((req) => (
                                    <UserCard
                                        key={req.id}
                                        user={req.profile}
                                        actionLabel="Accept"
                                        onAction={() => respondToRequest(req.id, "accepted")}
                                        secondaryActionLabel="Reject"
                                        onSecondaryAction={() =>
                                            respondToRequest(req.id, "rejected")
                                        }
                                        variant="request"
                                        loading={actionLoading === req.id}
                                    />
                                ))
                            )}
                        </div>
                    )}

                    {!isLoading && activeTab === "sent" && (
                        <div>
                            {sentRequests.length === 0 ? (
                                <div className="py-12 text-center text-muted-foreground">
                                    <p>No sent requests.</p>
                                </div>
                            ) : (
                                sentRequests.map((req) => (
                                    <UserCard
                                        key={req.id}
                                        user={req.profile}
                                        actionLabel="Cancel Request"
                                        onAction={() => cancelRequest(req.id)}
                                        loading={actionLoading === req.id}
                                    />
                                ))
                            )}
                        </div>
                    )}

                    {!isLoading && activeTab === "find" && (
                        <div>
                            <form onSubmit={handleSearch} className="mb-6 flex gap-4">
                                <div className="flex-1">
                                    <Input
                                        label=""
                                        placeholder="Search by email or name..."
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="mt-2 h-[42px]"
                                >
                                    {isLoading ? "Searching..." : "Search"}
                                </Button>
                            </form>

                            <div className="space-y-4">
                                {searchResults.map((user) => (
                                    <UserCard
                                        key={user.uid}
                                        user={user}
                                        actionLabel="Add Friend"
                                        onAction={() => sendRequest(user.uid)}
                                        variant="request"
                                        loading={actionLoading === user.uid}
                                    />
                                ))}
                                {searchResults.length === 0 && searchQuery && !isLoading && (
                                    <p className="mt-8 text-center text-muted-foreground">
                                        No users found.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ChatWindow
                isOpen={isChatOpen}
                onClose={handleCloseChat}
                recipient={chatRecipient}
                messages={chatMessages}
                onSendMessage={sendMessage}
                currentUserId={currentUser?.uid}
                loading={isChatLoading}
            />
        </div>
    );
}
