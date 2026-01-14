import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase-admin";
import { socialService } from "@/services/socialService";
import { userService } from "@/services/userService";

import { BaseController } from "./BaseController";

export class SocialController extends BaseController {
    async getFriends(request: Request) {
        try {
            const decodedToken = await this.getAuthenticatedUser(request);
            const connections = await socialService.getSocialConnections(decodedToken.uid);

            const otherUserIds = connections.map((c) =>
                c.requesterId === decodedToken.uid ? c.recipientId : c.requesterId,
            );

            const profiles = await userService.getUsersByIds(otherUserIds);
            const profileMap = new Map(profiles.map((p) => [p.uid, p]));

            const connectionsWithProfiles = connections
                .map((c) => {
                    const otherUserId =
                        c.requesterId === decodedToken.uid ? c.recipientId : c.requesterId;
                    const profile = profileMap.get(otherUserId);

                    if (!profile) return null;
                    return {
                        ...c,
                        profile,
                        isRequester: c.requesterId === decodedToken.uid,
                    };
                })
                .filter((c) => c !== null);

            return this.jsonResponse(connectionsWithProfiles);
        } catch (error) {
            return this.errorResponse(error as Error);
        }
    }

    async sendRequest(request: Request) {
        try {
            const decodedToken = await this.getAuthenticatedUser(request);
            const { recipientId } = await request.json();

            if (!recipientId) {
                throw new Error("Invalid: Recipient ID required");
            }

            const result = await socialService.sendFriendRequest(decodedToken.uid, recipientId);

            await adminDb.collection("notifications").add({
                userId: recipientId,
                type: "friend_request",
                title: "New Friend Request",
                body: `${decodedToken.name || decodedToken.email || "Someone"} sent you a friend request.`,
                data: {
                    requesterId: decodedToken.uid,
                    requestId: result.id,
                },
                isRead: false,
                createdAt: FieldValue.serverTimestamp(),
            });

            return this.jsonResponse(result);
        } catch (error) {
            return this.errorResponse(error as Error);
        }
    }

    async respondToRequest(request: Request, params: { id: string }) {
        try {
            const decodedToken = await this.getAuthenticatedUser(request);
            const { id } = params;
            const { status } = await request.json();

            if (status !== "accepted" && status !== "rejected") {
                throw new Error("Invalid: Invalid status");
            }

            const result = await socialService.respondToFriendRequest(id, decodedToken.uid, status);
            return this.jsonResponse(result);
        } catch (error) {
            return this.errorResponse(error as Error);
        }
    }

    async deleteFriend(request: Request, params: { id: string }) {
        try {
            const decodedToken = await this.getAuthenticatedUser(request);
            const { id } = params;

            const result = await socialService.deleteFriendship(id, decodedToken.uid);
            return this.jsonResponse(result);
        } catch (error) {
            return this.errorResponse(error as Error);
        }
    }

    async searchUsers(request: Request) {
        try {
            const decodedToken = await this.getAuthenticatedUser(request);
            const { searchParams } = new URL(request.url);
            const query = searchParams.get("q");

            if (!query) return this.jsonResponse([]);

            const results = await socialService.searchUsers(query, decodedToken.uid);

            const safeResults = results.map((u) => ({
                uid: u.uid,
                displayName: u.displayName,
                email: u.email,
                photoURL: u.photoURL,
                role: u.role,
            }));

            return this.jsonResponse(safeResults);
        } catch (error) {
            return this.errorResponse(error as Error);
        }
    }
}

export const socialController = new SocialController();
