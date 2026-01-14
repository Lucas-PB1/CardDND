import { UserProfile } from "./userService";
import { FriendRequestWithProfile } from "./socialService";
import { BaseApiService } from "./baseApiService";

export class SocialClientService extends BaseApiService {
    async searchUsers(query: string): Promise<UserProfile[]> {
        return this.get<UserProfile[]>(`/api/users/search?q=${encodeURIComponent(query)}`);
    }

    async sendFriendRequest(recipientId: string): Promise<{ id: string, status: string }> {
        return this.post<{ id: string, status: string }>("/api/social/request", { recipientId });
    }

    async respondToRequest(requestId: string, status: "accepted" | "rejected"): Promise<void> {
        return this.patch<void>(`/api/social/request/${requestId}`, { status });
    }

    async getSocialConnections(): Promise<FriendRequestWithProfile[]> {
        return this.get<FriendRequestWithProfile[]>("/api/social/friends");
    }

    async cancelRequest(requestId: string): Promise<{ id: string, deleted: boolean }> {
        return this.delete<{ id: string, deleted: boolean }>(`/api/social/request/${requestId}`);
    }
}

export const socialClient = new SocialClientService();

